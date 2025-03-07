require("dotenv").config();
const express = require("express");
const session = require('express-session');
const querystring = require("querystring");
const request = require("request");
const { spawn } = require("child_process");
const path = require("path");

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

// Update redirect_uri to match exactly what's in Spotify Dashboard
const redirect_uri = "http://localhost:3000/callback";

// const { Song } = require("./db/schemas/songs");
const fs = require('fs');

// User's access_token and refresh_token
var access_token;
var refresh_token;

const app = express();
app.set('spotify_access_token', access_token);

// Simplify middleware for testing
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));
app.use(session({
  secret: 'spotify-recommendation-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 } // 1 hour
}));

// Middleware to check for token
const requireToken = async (req, res, next) => {
  if (!access_token) {
    return res.status(401).json({ error: 'No access token. Please login first' });
  }
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    if (response.status === 401) {
      // Token expired, try refresh
      if (refresh_token) {
        access_token = await refreshAccessToken(refresh_token);
      } else {
        return res.status(401).json({ error: 'Token expired. Please login again' });
      }
    }
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Helper function that was missing
function generateRandomString(length) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function refreshAccessToken(refresh_token) {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    }),
  });

  const data = await response.json();
  return data.access_token;
}

// Auth-related routes - keep simple for Spotify OAuth
app.get("/login", function (req, res) {
  const state = generateRandomString(16);
  const scope = "user-read-private user-read-email playlist-read-private user-top-read";

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});

app.get("/callback", function (req, res) {
  const code = req.query.code || null;
  const state = req.query.state || null;

  if (state === null) {
    res.redirect('http://localhost:5173/#/error');
  } else {
    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        // Update the access token in the .env file
        const envPath = path.join(__dirname, 'algorithm/python_ML/config/.env');
        let envContent = fs.readFileSync(envPath, 'utf8');
        envContent = envContent.replace(/ACCESS_TOKEN=".*"/, `ACCESS_TOKEN="${body.access_token}"`);
        fs.writeFileSync(envPath, envContent);
        
        access_token = body.access_token;
        refresh_token = body.refresh_token;

        // Redirect to Vue frontend playlists page
        res.redirect('http://localhost:5173/#/playlists');
      } else {
        res.redirect('http://localhost:5173/#/error');
      }
    });
  }
});

// API routes - use /api prefix for all data operations
app.get("/api/auth-status", (req, res) => {
  res.json({ 
    isAuthenticated: !!access_token,
    hasRefreshToken: !!refresh_token
  });
});

app.get("/api/get-playlists", requireToken, async (req, res) => {
  const response = await fetch("https://api.spotify.com/v1/me/playlists", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const data = await response.json();
  res.json(data);
});

// Add middleware to protected routes
app.get("/api/playlist-tracks/:playlistId", requireToken, async (req, res) => {
  try {
    const playlistId = req.params.playlistId;
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch playlist tracks" });
  }
});

app.get("/api/top-tracks", requireToken, async (req, res) => {
  const response = await fetch("https://api.spotify.com/v1/me/top/tracks", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const data = await response.json();
  res.json(data);
});

// Route to get recommended songs
app.get("/api/recommended-songs", requireToken, async (req, res) => {
  try {
    // Run the Python script
    const pythonProcess = spawn("python3", [
      path.join(__dirname, "algorithm/python_ML/spotify-recommendation-engine.py")
    ]);

    let scriptOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      scriptOutput += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    pythonProcess.on("close", async (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: "Python script failed" });
      }

      try {
        // Parse the output from the Python script
        const result = JSON.parse(scriptOutput);
        // Batch fetch tracks from Spotify API
        const trackIds = result.map(track => track.id).join(',');
        const response = await fetch(`https://api.spotify.com/v1/tracks?ids=${trackIds}`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          }
        });
        const data = await response.json();

        // Map the image URLs to the original tracks
        const updatedTracks = result.map((track, index) => ({
          ...track,
          imgURL: data.tracks[index].album.images[0]?.url
        }));
        
        res.json(updatedTracks);
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to process recommended songs" });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to process recommended songs" });
  }
});

// Add a new endpoint to store user preferences
app.post("/api/preferences", requireToken, (req, res) => {
  try {
    // Store preferences in the session
    if (!req.session.userData) {
      req.session.userData = {};
    }
    
    // Save the preferences from the request body
    req.session.userData.preferences = req.body;
    
    res.json({ 
      success: true, 
      message: 'Preferences saved successfully' 
    });
  } catch (error) {
    console.error("Error saving preferences:", error);
    res.status(500).json({ error: "Failed to save preferences" });
  }
});

app.listen(3000, () => {
  console.log("App is listening on port 3000...");
});

require("dotenv").config();
const express = require("express");
const router = express.Router();

const querystring = require("querystring");
const request = require("request")

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

const redirect_uri = "http://localhost:3000/callback";

// Middleware to check for token
const requireToken = async (req, res, next) => {
  if (!req.session.access_token) {
    return res.status(401).json({ error: 'No access token. Please login first' });
  }
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${req.session.access_token}` }
    });
    if (response.status === 401) {
      // Token expired, try refresh
      if (req.session.refresh_token) {
        req.session.access_token = await refreshAccessToken(req.session.refresh_token);
      } else {
        return res.status(401).json({ error: 'Token expired. Please login again' });
      }
    }
    next();
  } catch (error) {
    console.error("Token validation error:", error); // Log the error
    res.status(401).json({ error: 'Invalid token' });
  }
};

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
router.get("/login", function (req, res) {
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

router.get("/callback", function (req, res) {
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
        req.session.access_token = body.access_token;
        req.session.refresh_token = body.refresh_token;

        // Redirect to Vue frontend playlists page
        res.redirect('http://localhost:5173/#/playlists');
      } else {
        res.redirect('http://localhost:5173/#/error');
      }
    });
  }
});

module.exports = router;
module.exports.requireToken = requireToken;
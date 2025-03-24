const express = require("express");
const { spawn } = require("child_process");
const path = require("path");
const router = express.Router();

const { requireToken } = require("./auth.routes");

router.get("/auth-status", (req, res) => {
  res.json({
    isAuthenticated: !!req.session.access_token,
    hasRefreshToken: !!req.session.refresh_token,
  });
});

router.get("/get-playlists", requireToken, async (req, res) => {
  console.log("Access Token:", req.session.access_token); // Log the token to ensure it's being set

  const response = await fetch("https://api.spotify.com/v1/me/playlists", {
    headers: {
      Authorization: `Bearer ${req.session.access_token}`,
    },
  });
  const data = await response.json();
  res.json(data);
});

router.get("/playlist-tracks/:playlistId", requireToken, async (req, res) => {
  try {
    const playlistId = req.params.playlistId;
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${req.session.access_token}`,
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


router.get("/recommended-songs", requireToken, async (req, res) => {
  try {
    // Initialize user data if needed
    req.session.userData = req.session.userData || {};
    
    // Convert preferences to string for comparison
    const currentPrefsString = JSON.stringify(req.session.userData?.preferences || {});
    const prevPrefsString = JSON.stringify(req.session.userData?.prevPreferences || {});
    
    // Check if we already have recommendations for current preferences
    if (
      prevPrefsString === currentPrefsString &&
      req.session.userData?.recommendedSongs
    ) {
      console.log('Using cached recommended songs');
      return res.json(req.session.userData.recommendedSongs);
    }
    
    console.log('Generating new recommendations...');
    
    // Store current preferences as previous preferences
    req.session.userData.prevPreferences = JSON.parse(currentPrefsString);
    
    const pythonProcess = spawn("python3", [
      path.join(
        __dirname,
        "../algorithm/python_ML/spotify-recommendation-engine.py"
      ),
      req.session.access_token,
      req.session.userData?.preferences
        ? JSON.stringify(req.session.userData.preferences)
        : "{}",
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
        const result = JSON.parse(scriptOutput);
        const trackIds = result.map((track) => track.id).join(",");
        const response = await fetch(
          `https://api.spotify.com/v1/tracks?ids=${trackIds}`,
          {
            headers: {
              Authorization: `Bearer ${req.session.access_token}`,
            },
          }
        );
        const data = await response.json();

        const updatedTracks = result.map((track, index) => ({
          ...track,
          imgURL: data.tracks[index].album.images[0]?.url,
        }));

        // Save recommendations to session
        req.session.userData.recommendedSongs = updatedTracks;
        
        // Save session first, then send response
        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
            return res.status(500).json({ error: "Failed to save session data" });
          }
          // Send response only after session is saved
          res.json(updatedTracks);
        });
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

router.post("/post-artists-preferences", requireToken, async (req, res) => {
  try {
    req.session.userData = req.session.userData || {};
    req.session.userData.preferences = req.session.userData.preferences || {};
    req.session.userData.preferences.artists = req.body.artists || [];

    // Save the session and send response
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ error: "Failed to save preferences" });
      }
      res.json({
        success: true,
        message: "Artists preferences saved successfully",
      });
    });
  } catch (error) {
    console.error("Error saving preferences:", error);
    res.status(500).json({ error: "Failed to save preferences" });
  }
});

router.post("/post-acousticness-preferences", requireToken, async (req, res) => {
  try {
    req.session.userData = req.session.userData || {};
    req.session.userData.preferences = req.session.userData.preferences || {};
    req.session.userData.preferences.acousticness = req.body.acousticness || false;

    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ error: "Failed to save preferences" });
      }
      res.json({
        success: true,
        message: "Preferences saved successfully",
      });
    });
  } catch (error) {
    console.error("Error saving preferences:", error);
    res.status(500).json({ error: "Failed to save preferences" });
  }
});

router.post("/post-remaining-preferences", requireToken, async (req, res) => {
  try {
    const remainingPreferences = req.body;

    req.session.userData = req.session.userData || {};
    req.session.userData.preferences = req.session.userData.preferences || {};
    req.session.userData.preferences.year = remainingPreferences.year || {};
    req.session.userData.preferences.duration = remainingPreferences.duration || {};
    req.session.userData.preferences.tempo = remainingPreferences.tempo || {};

    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ error: "Failed to save preferences" });
      }
      res.json({
        success: true,
        message: "Music preferences saved successfully",
      });
    });
  } catch (error) {
    console.error("Error saving preferences:", error);
    res.status(500).json({ error: "Failed to save preferences" });
  }
});

// Export the router with the prefix /api
module.exports = router;
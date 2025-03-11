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

router.get("/top-tracks", requireToken, async (req, res) => {
  const response = await fetch("https://api.spotify.com/v1/me/top/tracks", {
    headers: {
      Authorization: `Bearer ${req.session.access_token}`,
    },
  });
  const data = await response.json();
  res.json(data);
});

router.get("/recommended-songs", requireToken, async (req, res) => {
  try {
    // const preferences = {
    //   year: {
    //     start: 2012,
    //     end: 2015,
    //   },
    //   duration: {
    //     start: 200000,
    //     end: 300000,
    //   },
    //   tempo: {
    //     start: 60,
    //     end: 120,
    //   },
    // }; // Test preferences
    const pythonProcess = spawn("python3", [
      path.join(
        __dirname,
        "../algorithm/python_ML/spotify-recommendation-engine.py"
      ),
      req.session.access_token, // Pass the access token as an argument
      req.session.userData?.preferences
        ? JSON.stringify(req.session.userData.preferences)
        : "{}",
      // JSON.stringify(preferences), // Test preferences
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

router.post("/preferences", requireToken, (req, res) => {
  try {
    if (!req.session.userData) {
      req.session.userData = {};
    }

    req.session.userData.preferences = req.body;

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

router.get("/preferences", requireToken, (req, res) => {
  try {
    const preferences = req.session.userData?.preferences || {};
    console.log("Retrieved preferences:", preferences);
    res.json(preferences);
  } catch (error) {
    console.error("Error retrieving preferences:", error);
    res.status(500).json({ error: "Failed to retrieve preferences" });
  }
});

// Export the router with the prefix /api
module.exports = router;

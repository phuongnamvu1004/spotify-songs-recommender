const express = require("express");
const router = express.Router();

const { requireToken } = require("./auth.routes");

router.get("/auth-status", (req, res) => {
  res.json({
    isAuthenticated: !!req.session.access_token,
    hasRefreshToken: !!req.session.refresh_token,
  });
});

router.get("/get-playlists", requireToken, async (req, res) => {
  try {
    if (!req.session || !req.session.access_token) {
      console.error("Access token is missing");
      return res.status(401).json({ error: "Authentication required" });
    }

    const response = await fetch("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: `Bearer ${req.session.access_token}`,
      },
    });

    if (!response.ok) {
      console.error("Spotify API error:", await response.text());
      return res.status(response.status).json({ error: "Failed to fetch playlists" });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({ error: "Internal server error" });
  }
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

module.exports = router;
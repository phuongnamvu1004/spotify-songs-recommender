import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/get-playlists", async (req, res) => {
  const response = await fetch("https://api.spotify.com/v1/me/playlists", {
    headers: {
      Authorization: `Bearer ${req.app.get('spotify_access_token')}`,
    },
  });
  const data = await response.json();
  res.json(data);
});

router.get("/playlist-tracks/:playlistId", async (req, res) => {
  try {
    const playlistId = req.params.playlistId;
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${req.app.get('spotify_access_token')}`,
        }
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch playlist tracks" });
  }
});

router.get("/top-tracks", async (req, res) => {
  const response = await fetch("https://api.spotify.com/v1/me/top/tracks", {
    headers: {
      Authorization: `Bearer ${req.app.get('spotify_access_token')}`,
    },
  });
  const data = await response.json();
  res.json(data);
});

export default router;
// /controllers/playlistController.js
import fetch from 'node-fetch';
import { access_token } from '../config/config.js';

export const getPlaylists = async (req, res) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
};

export const getPlaylistTracks = async (req, res) => {
  try {
    const playlistId = req.params.playlistId;
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching playlist tracks:', error);
    res.status(500).json({ error: 'Failed to fetch playlist tracks' });
  }
};

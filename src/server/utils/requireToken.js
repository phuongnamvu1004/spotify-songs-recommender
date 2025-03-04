// /utils/requireToken.js
const fetch = require('node-fetch');
const { access_token, refresh_token } = require('../config/spotify');
const refreshAccessToken = require('../services/spotifyService').refreshAccessToken;

module.exports = async (req, res, next) => {
  if (!access_token) {
    return res.status(401).json({ error: 'No access token. Please login first' });
  }
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    if (response.status === 401) {
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

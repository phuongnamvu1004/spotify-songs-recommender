// /routes/playlistRoutes.js
const express = require('express');
const { getPlaylists, getPlaylistTracks } = require('../controllers/playlistController');
const requireToken = require('../utils/requireToken');
const router = express.Router();

router.get('/api/get-playlists', requireToken, getPlaylists);
router.get('/api/playlist-tracks/:playlistId', requireToken, getPlaylistTracks);

module.exports = router;

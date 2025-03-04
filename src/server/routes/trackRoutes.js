// /routes/trackRoutes.js
const express = require('express');
const { getTopTracks, processTracks } = require('../controllers/trackController');
const requireToken = require('../utils/requireToken');
const router = express.Router();

router.get('/api/top-tracks', requireToken, getTopTracks);
router.post('/api/process-tracks', requireToken, processTracks);

module.exports = router;

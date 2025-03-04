// /controllers/trackController.js
const fetch = require('node-fetch');
const { access_token } = require('../config/spotify');
const { Song } = require('../db/schemas/songs');

const getTopTracks = async (req, res) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/top/tracks', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    res.status(500).json({ error: 'Failed to fetch top tracks' });
  }
};

const processTracks = async (req, res) => {
  try {
    const { tracks } = req.body;

    const trackIds = tracks.map((track) => track.id);
    const featuresResponse = await fetch(
      `https://api.spotify.com/v1/audio-features?ids=${trackIds.join(',')}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const featuresData = await featuresResponse.json();

    const processedTracks = tracks.map((track, index) => ({
      artist_name: track.artists[0].name.substring(0, 255),
      track_name: track.name.substring(0, 500),
      track_id: track.id,
      popularity: track.popularity,
      duration_ms: track.duration_ms,
      explicit: track.explicit,
      ...featuresData.audio_features[index],
    }));

    await Song.bulkCreate(processedTracks, {
      ignoreDuplicates: true,
    });

    res.json({ processed: processedTracks.length });
  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({ error: 'Failed to process tracks' });
  }
};

module.exports = {
  getTopTracks,
  processTracks,
};

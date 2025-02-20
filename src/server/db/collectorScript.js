// collector-script.js
const { Sequelize } = require("sequelize");
const { SpotifyDataCollector } = require('./dataCollector');

const sequelize = new Sequelize("song_recommender_prj", "phuong-namvu", "", {
  host: "localhost",
  dialect: "postgres",
  port: 5432,
  logging: false,
});

const collector = new SpotifyDataCollector({
  serverUrl: 'http://localhost:3000',
  maxSongs: 100000,
  batchSize: 100,
  fetchInterval: 10000,
  sequelize
});

// Example playlist IDs - replace with your target playlists
const playlistIds = [
  '37i9dQZF1DXcBWIGoYBM5M',
  '37i9dQZF1DX0XUsuxWHRQd'
];

// Start collection - runs immediately and then daily at midnight
collector.startCollection(playlistIds, '0 0 * * *');
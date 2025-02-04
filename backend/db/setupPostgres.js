const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const Papa = require('papaparse');

// PostgreSQL Connection
const sequelize = new Sequelize('song_recommender_prj', 'phuong-namvu', '', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  logging: false  // Disable logging SQL queries
});

// Define Song Model
const Song = sequelize.define(
  "Song",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    artist_name: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    track_name: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    track_id: {
      type: DataTypes.STRING(500),
      unique: true,
    },
    popularity: {
      type: DataTypes.INTEGER,
      validate: { min: 0, max: 100 },
    },
    year: {
      type: DataTypes.INTEGER,
      validate: { min: 1900, max: new Date().getFullYear() },
    },
    genre: {
      type: DataTypes.STRING(500),
    },
    danceability: {
      type: DataTypes.FLOAT,
      validate: { min: 0, max: 1 },
    },
    energy: {
      type: DataTypes.FLOAT,
      validate: { min: 0, max: 1 },
    },
    key: {
      type: DataTypes.INTEGER,
      validate: { min: -1, max: 11 },
    },
    loudness: {
      type: DataTypes.FLOAT,
      validate: { min: -60.0, max: 0.0 },
    },
    mode: {
      type: DataTypes.INTEGER,
      validate: { min: 0, max: 1 },
    },
    speechiness: {
      type: DataTypes.FLOAT,
      validate: { min: 0.0, max: 1.0 },
    },
    acousticness: {
      type: DataTypes.FLOAT,
      validate: { min: 0.0, max: 1.0 },
    },
    instrumentalness: {
      type: DataTypes.FLOAT,
      validate: { min: 0.0, max: 1.0 },
    },
    liveness: {
      type: DataTypes.FLOAT,
      validate: { min: 0.0, max: 1.0 },
    },
    valence: {
      type: DataTypes.FLOAT,
      validate: { min: 0.0, max: 1.0 },
    },
    tempo: {
      type: DataTypes.FLOAT,
    },
    duration_ms: {
      type: DataTypes.INTEGER,
    },
    time_signature: {
      type: DataTypes.INTEGER,
      validate: { min: 3, max: 7 },
    },
  },
  {
    indexes: [
      { fields: ["artist_name"] },
      { fields: ["genre"] },
      { fields: ["year"] },
    ],
  }
);

async function importCsvToPostgres(csvFilePath) {
  try {
    // Sync model (create table if not exists)
    await sequelize.sync({ alter: true });

    // Read CSV
    const csvFile = fs.readFileSync(csvFilePath, 'utf-8');
    const results = Papa.parse(csvFile, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true
    });

    // Define max lengths (adjust according to your schema)
    const MAX_ARTIST_NAME_LENGTH = 255;
    const MAX_TRACK_NAME_LENGTH = 500;

    // Batch insert
    const batchSize = 1000;
    for (let i = 0; i < results.data.length; i += batchSize) {
      const batch = results.data.slice(i, i + batchSize);
      
      await Song.bulkCreate(batch.map(row => ({
        artist_name: typeof row['artist_name'] === 'string' ? row['artist_name'].substring(0, 255) : '',
        track_name: typeof row['track_name'] === 'string' ? row['track_name'].substring(0, 500) : '',
        track_id: row['track_id'],
        popularity: row['popularity'],
        year: row['year'],
        genre: row['genre'],
        danceability: row['danceability'],
        energy: row['energy'],
        key: row['key'],
        loudness: row['loudness'],
        mode: row['mode'],
        speechiness: row['speechiness'],
        acousticness: row['acousticness'],
        instrumentalness: row['instrumentalness'],
        liveness: row['liveness'],
        valence: row['valence'],
        tempo: row['tempo'],
        duration_ms: row['duration_ms'],
        time_signature: row['time_signature']
      })), { 
        ignoreDuplicates: true 
      });

      console.log(`Imported ${i + batch.length} / ${results.data.length} songs`);
    }

    console.log('Import complete');
  } catch (error) {
    console.error('Import error:', error);
  } finally {
    await sequelize.close();
  }
}

importCsvToPostgres('./spotify_data.csv');
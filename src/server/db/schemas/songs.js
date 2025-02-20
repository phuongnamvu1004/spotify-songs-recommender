const { DataTypes } = require("sequelize");
const { sequelize } = require("../setUpPostgres");

const Song = sequelize.define(
  "Song",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Store artists as a native PostgreSQL array
    artists: {
      type: DataTypes.ARRAY(DataTypes.STRING(500)),
      allowNull: false,
    },
    // Keep artist_name for primary artist
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
    // Store genres as a native PostgreSQL array
    genres: {
      type: DataTypes.ARRAY(DataTypes.STRING(500)),
      defaultValue: [],
    },
    // Keep genre for primary genre
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
      // Add GIN indexes for array fields for better performance
      { using: 'GIN', fields: ['artists'] },
      { using: 'GIN', fields: ['genres'] }
    ],
  }
);

module.exports = Song;
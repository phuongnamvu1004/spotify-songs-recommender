const { sequelize } = require("../setUpPostgres");

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

module.exports = Song;

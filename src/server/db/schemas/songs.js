const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("song_recommender_prj", "phuong-namvu", "", {
  host: "localhost",
  dialect: "postgres",
  port: 5432,
  logging: false, // Disable logging SQL queries
});

// Define Song Model
const Song = sequelize.define(
  "Song",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      field: "id"
    },
    name: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    artists: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    duration_ms: {
      type: DataTypes.INTEGER,
    },
    release_date: {
      type: DataTypes.STRING,
    },
    year: {
      type: DataTypes.INTEGER,
    },
    acousticness: {
      type: DataTypes.FLOAT,
    },
    danceability: {
      type: DataTypes.FLOAT,
    },
    energy: {
      type: DataTypes.FLOAT,
    },
    instrumentalness: {
      type: DataTypes.FLOAT,
    },
    liveness: {
      type: DataTypes.FLOAT,
    },
    loudness: {
      type: DataTypes.FLOAT,
    },
    speechiness: {
      type: DataTypes.FLOAT,
    },
    tempo: {
      type: DataTypes.FLOAT,
    },
    valence: {
      type: DataTypes.FLOAT,
    },
    mode: {
      type: DataTypes.INTEGER,
    },
    key: {
      type: DataTypes.INTEGER,
    },
    popularity: {
      type: DataTypes.INTEGER,
    },
    explicit: {
      type: DataTypes.BOOLEAN,
    }
  },
  {
    tableName: "Songs", // Explicitly define the table name in lowercase
    indexes: [
      { fields: ["artists"] },
      { fields: ["year"] },
    ],
  }
);

module.exports = { Song, sequelize };
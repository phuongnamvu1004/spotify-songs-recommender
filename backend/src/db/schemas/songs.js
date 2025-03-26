const { Sequelize, DataTypes } = require("sequelize");

require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgres",
  logging: false, // Disable logging SQL queries
  dialectOptions: {
    ssl: {
      require: true, // Enforce SSL
      rejectUnauthorized: false, // Allow self-signed certificates (Render uses trusted certificates, so this is safe)
    },
  },
});

// Define Song Model
const Song = sequelize.define(
  "songs", // Use lowercase for table name
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    artists: {
      type: DataTypes.STRING(1000), // Increased length for array storage
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
    tableName: 'songs', // Force table name to be lowercase
    timestamps: true, // Enable timestamps (createdAt, updatedAt)
    underscored: true, // Use snake_case for column names
    indexes: [
      { fields: ["artists"] },
      { fields: ["year"] },
    ],
  }
);

module.exports = { Song, sequelize };
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("song_recommender_prj", "phuong-namvu", "", {
  host: "localhost",
  dialect: "postgres",
  port: 5432,
  logging: false, // Disable logging SQL queries
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

// // Force sync to recreate the table
// sequelize.sync({ force: true })
//   .then(() => {
//     console.log("Table created successfully!");
//   })
//   .catch((error) => {
//     console.error("Error creating table:", error);
//   });

module.exports = { Song, sequelize };
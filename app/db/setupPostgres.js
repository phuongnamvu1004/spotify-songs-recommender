const { Sequelize, DataTypes } = require("sequelize");
const fs = require("fs");
const Papa = require("papaparse");
const { Song } = require("./schemas/songs");

// PostgreSQL Connection
const sequelize = new Sequelize("song_recommender_prj", "phuong-namvu", "", {
  host: "localhost",
  dialect: "postgres",
  port: 5432,
  logging: false, // Disable logging SQL queries
});

async function importCsvToPostgres(csvFilePath) {
  try {
    // Sync model (create table if not exists)
    await sequelize.sync({ alter: true });

    // Read CSV
    const csvFile = fs.readFileSync(csvFilePath, "utf-8");
    const results = Papa.parse(csvFile, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    });

    // Define max lengths (adjust according to your schema)
    const MAX_ARTIST_NAME_LENGTH = 255;
    const MAX_TRACK_NAME_LENGTH = 500;

    // Batch insert
    const batchSize = 1000;
    for (let i = 0; i < results.data.length; i += batchSize) {
      const batch = results.data.slice(i, i + batchSize);

      await Song.bulkCreate(
        batch.map((row) => ({
          artist_name:
            typeof row["artist_name"] === "string"
              ? row["artist_name"].substring(0, 255)
              : "",
          track_name:
            typeof row["track_name"] === "string"
              ? row["track_name"].substring(0, 500)
              : "",
          track_id: row["track_id"],
          popularity: row["popularity"],
          year: row["year"],
          genre: row["genre"],
          danceability: row["danceability"],
          energy: row["energy"],
          key: row["key"],
          loudness: row["loudness"],
          mode: row["mode"],
          speechiness: row["speechiness"],
          acousticness: row["acousticness"],
          instrumentalness: row["instrumentalness"],
          liveness: row["liveness"],
          valence: row["valence"],
          tempo: row["tempo"],
          duration_ms: row["duration_ms"],
          time_signature: row["time_signature"],
        })),
        {
          ignoreDuplicates: true,
        }
      );

      console.log(
        `Imported ${i + batch.length} / ${results.data.length} songs`
      );
    }

    console.log("Import complete");
  } catch (error) {
    console.error("Import error:", error);
  } finally {
    await sequelize.close();
  }
}

importCsvToPostgres("./spotify_data.csv");

module.exports = { sequelize };

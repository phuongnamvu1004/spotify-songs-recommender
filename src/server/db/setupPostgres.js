const { Sequelize } = require("sequelize");
const fs = require("fs");
const Papa = require("papaparse");

// PostgreSQL Connection
const sequelize = new Sequelize("song_recommender_prj", "phuong-namvu", "", {
  host: "localhost",
  dialect: "postgres",
  port: 5432,
  logging: false, // Disable logging SQL queries
});

// Import Song model after sequelize is defined to avoid circular dependency
const { Song } = require("./schemas/songs");

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
          id: row["id"],
          name: typeof row["name"] === "string" ? row["name"].substring(0, MAX_TRACK_NAME_LENGTH) : "",
          artists: typeof row["artists"] === "string" ? row["artists"].substring(0, MAX_ARTIST_NAME_LENGTH) : "",
          duration_ms: row["duration_ms"],
          release_date: row["release_date"],
          year: row["year"],
          acousticness: row["acousticness"],
          danceability: row["danceability"],
          energy: row["energy"],
          instrumentalness: row["instrumentalness"],
          liveness: row["liveness"],
          loudness: row["loudness"],
          speechiness: row["speechiness"],
          tempo: row["tempo"],
          valence: row["valence"],
          mode: row["mode"],
          key: row["key"],
          popularity: row["popularity"],
          explicit: row["explicit"],
        })),
        {
          ignoreDuplicates: true,
        }
      );

      console.log(`Imported ${i + batch.length} / ${results.data.length} songs`);
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
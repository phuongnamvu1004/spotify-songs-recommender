const { Sequelize } = require("sequelize");
const fs = require("fs");
const Papa = require("papaparse");

// Import Song model after sequelize is defined to avoid circular dependency
const { Song, sequelize } = require("./schemas/songs");

async function importCsvToPostgres(csvFilePath) {
  try {
    // Read CSV
    const csvFile = fs.readFileSync(csvFilePath, "utf-8");
    const results = Papa.parse(csvFile, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    });

    // Batch insert
    const batchSize = 100; // Reduced batch size for testing
    for (let i = 0; i < results.data.length; i += batchSize) {
      const batch = results.data.slice(i, i + batchSize);

      try {
        await Song.bulkCreate(
          batch.map((row) => ({
            id: row["id"],
            name: row["name"],
            artists: JSON.stringify(row["artists"]), // Convert array to string
            duration_ms: row["duration_ms"],
            release_date: row["release_date"],
            year: row["year"],
            acousticness: parseFloat(row["acousticness"]),
            danceability: parseFloat(row["danceability"]),
            energy: parseFloat(row["energy"]),
            instrumentalness: parseFloat(row["instrumentalness"]),
            liveness: parseFloat(row["liveness"]),
            loudness: parseFloat(row["loudness"]),
            speechiness: parseFloat(row["speechiness"]),
            tempo: parseFloat(row["tempo"]),
            valence: parseFloat(row["valence"]),
            mode: parseInt(row["mode"]),
            key: parseInt(row["key"]),
            popularity: parseInt(row["popularity"]),
            explicit: Boolean(row["explicit"]),
          })),
          {
            ignoreDuplicates: true,
          }
        );

        console.log(
          `Imported ${i + batch.length} / ${results.data.length} songs`
        );
      } catch (error) {
        console.error("Error in batch:", error);
        console.error("First row of failing batch:", batch[0]);
      }
    }

    console.log("Import complete");
  } catch (error) {
    console.error("Import error:", error);
  } finally {
    await sequelize.close();
  }
}

// Wait for table creation before importing data
setTimeout(() => {
  importCsvToPostgres("./spotify_data.csv");
}, 1000);

module.exports = { sequelize };
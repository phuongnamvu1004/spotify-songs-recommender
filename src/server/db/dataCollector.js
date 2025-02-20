// data-collector.js
const { Sequelize } = require("sequelize");
const cron = require("node-cron");


class SpotifyDataCollector {
  constructor(config) {
    this.serverUrl = config.serverUrl || "http://localhost:3000";
    this.maxSongs = config.maxSongs || 100000;
    this.batchSize = config.batchSize || 100;
    this.fetchInterval = config.fetchInterval || 10000; // 10 seconds
    this.sequelize = config.sequelize;
    this.totalSongsFetched = 0;
  }

  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async collectFromPlaylist(playlistId) {
    try {
      // First check auth status
      const authResponse = await fetch(`${this.serverUrl}/api/auth-status`);
      const authData = await authResponse.json();

      if (!authData.isAuthenticated) {
        console.log("Not authenticated. Skipping collection.");
        return;
      }

      // Get tracks from the playlist
      const response = await fetch(
        `${this.serverUrl}/api/playlist-tracks/${playlistId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Process tracks in batches
      const tracks = data.items.map((item) => item.track);

      for (let i = 0; i < tracks.length; i += this.batchSize) {
        if (this.totalSongsFetched >= this.maxSongs) {
          console.log(`Reached maximum song limit of ${this.maxSongs}`);
          break;
        }

        const batch = tracks.slice(
          i,
          Math.min(i + this.batchSize, tracks.length)
        );

        // Send batch to processing endpoint
        const processResponse = await fetch(
          `${this.serverUrl}/api/process-tracks`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ tracks: batch }),
          }
        );

        if (!processResponse.ok) {
          throw new Error(
            `Processing error! status: ${processResponse.status}`
          );
        }

        const processedCount = await processResponse.json();
        this.totalSongsFetched += processedCount.processed;

        console.log(
          `Processed ${processedCount.processed} tracks. Total: ${this.totalSongsFetched}`
        );

        // Respect rate limiting
        await this.sleep(this.fetchInterval);
      }
    } catch (error) {
      console.error("Collection error:", error);
    }
  }

  async startCollection(playlistIds, schedule = "0 0 * * *") {
    // Default to daily at midnight
    try {
      // Initial collection
      for (const playlistId of playlistIds) {
        await this.collectFromPlaylist(playlistId);
      }

      // Schedule recurring collection
      cron.schedule(schedule, async () => {
        console.log("Starting scheduled collection...");
        this.totalSongsFetched = 0; // Reset counter for new collection

        for (const playlistId of playlistIds) {
          await this.collectFromPlaylist(playlistId);
        }
      });
    } catch (error) {
      console.error("Collection error:", error);
    }
  }
}

module.exports = { SpotifyDataCollector };

const express = require("express");
const { spawn } = require("child_process");
const path = require("path");
const router = express.Router();
const { requireToken } = require("./auth.routes");

// Route: Trigger recommendations
router.post("/recommended-songs", requireToken, (req, res) => {
  try {
    req.session.userData = req.session.userData || {};

    const currentPrefsString = JSON.stringify(req.session.userData?.preferences || {});
    const prevPrefsString = JSON.stringify(req.session.userData?.prevPreferences || {});

    if (
      prevPrefsString === currentPrefsString &&
      req.session.userData?.recommendedSongs
    ) {
      console.log("✅ Using cached recommendations.");
      req.session.userData.loadingRecommendations = false;
      return res.status(200).json({ cached: true });
    }

    console.log("🔄 Preferences changed, generating new recommendations...");
    req.session.userData.prevPreferences = JSON.parse(currentPrefsString);
    req.session.userData.loadingRecommendations = true;

    req.session.save((err) => {
      if (err) {
        console.error("❌ Failed to save session before Python spawn:", err);
        return res.status(500).json({ error: "Could not save loading state" });
      }

      const scriptPath = path.join(__dirname, "../algorithm/python_ML/spotify-recommendation-engine.py");

      console.log("🚀 Spawning Python process:", scriptPath);
      const pythonProcess = spawn("python3", [
        scriptPath,
        req.session.access_token,
        currentPrefsString,
      ]);

      pythonProcess.stdout.on("data", (data) => {
        console.log("🐍 Python stdout:", data.toString());
      });

      pythonProcess.stderr.on("data", (data) => {
        console.error("⚠️ Python stderr:", data.toString());
      });

      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          console.error("❌ Python process exited with code", code);
        } else {
          console.log("✅ Python script completed successfully");
        }
      });

      res.status(202).json({ message: "Generating recommendations..." });
    });
  } catch (err) {
    console.error("❌ Trigger error:", err);
    res.status(500).json({ error: "Failed to start recommendation engine" });
  }
});

// Route: Callback from Python
router.post("/recommended-songs/callback", requireToken, (req, res) => {
  try {
    const { recommendedSongs } = req.body;

    console.log("📥 Callback received from Python. Songs:", Array.isArray(recommendedSongs) ? recommendedSongs.length : "invalid format");

    if (!recommendedSongs || !Array.isArray(recommendedSongs)) {
      return res.status(400).json({ error: "Invalid payload from Python" });
    }

    req.session.userData = req.session.userData || {};
    req.session.userData.recommendedSongs = recommendedSongs;
    req.session.userData.loadingRecommendations = false;

    req.session.save((err) => {
      if (err) {
        console.error("❌ Session save failed in callback:", err);
        return res.status(500).json({ error: "Could not save recommendations" });
      }
      console.log("✅ Recommendations saved successfully into session.");
      res.status(200).json({ success: true });
    });
  } catch (err) {
    console.error("❌ Callback error:", err);
    res.status(500).json({ error: "Failed to process callback" });
  }
});

// Route: Frontend fetches recommendations
router.get("/recommended-songs", requireToken, (req, res) => {
  req.session.userData = req.session.userData || {};
  const { recommendedSongs, loadingRecommendations = false } = req.session.userData;

  console.log(`📤 GET /recommended-songs → loading: ${loadingRecommendations}, count: ${recommendedSongs?.length || 0}`);

  res.status(200).json({
    loading: loadingRecommendations,
    recommendations: recommendedSongs || null,
  });
});

module.exports = router;

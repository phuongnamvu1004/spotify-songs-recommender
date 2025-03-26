const express = require("express");
const router = express.Router();

const { requireToken } = require("./auth.routes");

router.post("/post-artists-preferences", requireToken, async (req, res) => {
  try {
    req.session.userData = req.session.userData || {};
    req.session.userData.preferences = req.session.userData.preferences || {};
    req.session.userData.preferences.artists = req.body.artists || [];

    // Save the session and send response
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ error: "Failed to save preferences" });
      }
      res.json({
        success: true,
        message: "Artists preferences saved successfully",
      });
    });
  } catch (error) {
    console.error("Error saving preferences:", error);
    res.status(500).json({ error: "Failed to save preferences" });
  }
});

router.post("/post-acousticness-preferences", requireToken, async (req, res) => {
  try {
    req.session.userData = req.session.userData || {};
    req.session.userData.preferences = req.session.userData.preferences || {};
    req.session.userData.preferences.acousticness = req.body.acousticness || false;

    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ error: "Failed to save preferences" });
      }
      res.json({
        success: true,
        message: "Preferences saved successfully",
      });
    });
  } catch (error) {
    console.error("Error saving preferences:", error);
    res.status(500).json({ error: "Failed to save preferences" });
  }
});

router.post("/post-remaining-preferences", requireToken, async (req, res) => {
  try {
    const remainingPreferences = req.body;

    req.session.userData = req.session.userData || {};
    req.session.userData.preferences = req.session.userData.preferences || {};
    req.session.userData.preferences.year = remainingPreferences.year || {};
    req.session.userData.preferences.duration = remainingPreferences.duration || {};
    req.session.userData.preferences.tempo = remainingPreferences.tempo || {};

    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ error: "Failed to save preferences" });
      }
      res.json({
        success: true,
        message: "Music preferences saved successfully",
      });
    });
  } catch (error) {
    console.error("Error saving preferences:", error);
    res.status(500).json({ error: "Failed to save preferences" });
  }
});

// Export the router with the prefix /api
module.exports = router;
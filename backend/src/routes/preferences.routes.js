import express from "express";
const router = express.Router();

import { requireToken } from "../middleware/auth.middleware.js";
import {
  postArtistsPreferences,
  postAcousticnessPreferences,
  postRemainingPreferences,
} from "../controllers/preferences.controller.js";

router.post("/post-artists-preferences", requireToken, postArtistsPreferences);
router.post("/post-acousticness-preferences", requireToken, postAcousticnessPreferences);
router.post("/post-remaining-preferences", requireToken, postRemainingPreferences);

export default router;

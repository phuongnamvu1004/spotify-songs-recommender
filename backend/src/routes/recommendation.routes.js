import express from "express";
import { requireToken } from "../middleware/auth.middleware.js";
import { getRecommendedSongs } from "../controllers/recommendation.controller.js";

const router = express.Router();

router.get("/recommended-songs", requireToken, getRecommendedSongs);

export default router;

import express from "express";
import { requireToken } from "../middleware/auth.middleware.js";
import { getRecommendations } from "../controllers/recommendation.controller.js";

const router = express.Router();

router.get("/recommended-songs", requireToken, getRecommendations);

export default router;

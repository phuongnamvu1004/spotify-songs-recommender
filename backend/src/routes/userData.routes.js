import express from "express"
const router = express.Router();

import { requireToken } from "../middleware/auth.middleware.js";
import {
  getAuthStatus,
  getPlaylists,
  getSessionDump,
  getPlaylistTracks,
} from "../controllers/userData.controller.js";

router.get("/auth-status", getAuthStatus);

router.get("/get-playlists", requireToken, getPlaylists);
router.get("/playlist-tracks/:playlistId", requireToken, getPlaylistTracks);

router.get("/session-dump", getSessionDump);

export default router;

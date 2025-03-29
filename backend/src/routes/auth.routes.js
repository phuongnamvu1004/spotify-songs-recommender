import dotenv from "dotenv";
import express from "express";

dotenv.config();
const router = express.Router();

import { login, callback } from "../controllers/auth.controller.js"

router.get("/login", login);
router.get("/callback", callback);

export default router;
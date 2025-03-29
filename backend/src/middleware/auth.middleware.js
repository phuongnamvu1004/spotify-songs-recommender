import { refreshAccessToken } from "../lib/utils.js";

/**
 * Middleware to check for a valid access token
 */
export const requireToken = async (req, res, next) => {
  if (!req.session.access_token) {
    return res.status(401).json({ error: "No access token. Please login first" });
  }
  try {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${req.session.access_token}` },
    });
    if (response.status === 401) {
      // Token expired, try refresh
      if (req.session.refresh_token) {
        req.session.access_token = await refreshAccessToken(req.session.refresh_token);
      } else {
        return res.status(401).json({ error: "Token expired. Please login again" });
      }
    }
    next();
  } catch (error) {
    console.error("Token validation error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};
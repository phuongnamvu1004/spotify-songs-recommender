require("dotenv").config();

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

/**
 * Generate a random string for state parameter in OAuth
 */
function generateRandomString(length) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

/**
 * Refresh the Spotify access token using the refresh token
 */
async function refreshAccessToken(refresh_token) {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    }),
  });

  const data = await response.json();
  if (!data.access_token) {
    throw new Error("Failed to refresh access token");
  }
  return data.access_token;
}

/**
 * Middleware to check for a valid access token
 */
const requireToken = async (req, res, next) => {
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

module.exports = {
  generateRandomString,
  refreshAccessToken,
  requireToken,
};
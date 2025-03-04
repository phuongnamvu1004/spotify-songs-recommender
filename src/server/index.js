import express from 'express';
import path from 'path';
import authRoutes from './routes/auth.js';
import playlistRoutes from './routes/playlists.js';
import recommendationRoutes from './routes/recommendations.js';
import { refreshAccessToken } from './utils/helpers.js';

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

let access_token;
let refresh_token;

// Middleware to check for token
const requireToken = async (req, res, next) => {
  if (!access_token) {
    return res.status(401).json({ error: 'No access token. Please login first' });
  }
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    if (response.status === 401) {
      if (refresh_token) {
        access_token = await refreshAccessToken(refresh_token);
      } else {
        return res.status(401).json({ error: 'Token expired. Please login again' });
      }
    }
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Use routes
app.use("/api/*", requireToken);
app.use("/api/", authRoutes);
app.use("/api/", playlistRoutes);
app.use("/api/", recommendationRoutes);

app.listen(3000, () => {
  console.log("App is listening on port 3000...");
});

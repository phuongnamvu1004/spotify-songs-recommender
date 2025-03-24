const express = require("express");
const session = require('express-session');
const { createClient } = require('redis');
const RedisStore = require('connect-redis').default;
const path = require("path");

const apiRouter = require('./routes/api.routes');
const authRouter = require('./routes/auth.routes');

require('dotenv').config();

// Initialize Redis client
const redisClient = createClient(
  {
    socket: {
      host: process.env.REDIS_HOST || "redis", // Use "redis" as the hostname
      port: process.env.REDIS_PORT || 6379
    }
  }
);

redisClient.connect().catch(console.error);

// Handle Redis connection errors
redisClient.on('error', (err) => {
  console.log('Redis Client Error', err);
});

// Initialize Redis store
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "spotify-session:",
});

const app = express();

// Simplify middleware for testing
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));
app.use(session({
  store: redisStore,
  secret: 'spotify-recommendation-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // true in production
    httpOnly: true,
    maxAge: 3600000 // 1 hour
  }
}));

app.use("/api", apiRouter);
app.use("/", authRouter);

app.listen(3000, () => {
  console.log("App is listening on port 3000...");
});


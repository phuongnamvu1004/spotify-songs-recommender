const express = require("express");
const session = require('express-session');
const path = require("path");

const apiRouter = require('./routes/api.routes');
const authRouter = require('./routes/auth.routes');

const app = express();

// Simplify middleware for testing
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));
app.use(session({
  secret: 'spotify-recommendation-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 } // 1 hour
}));

app.use("/api", apiRouter);
app.use("/", authRouter);

app.listen(3000, () => {
  console.log("App is listening on port 3000...");
});


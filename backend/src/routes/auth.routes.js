require("dotenv").config();
const express = require("express");
const router = express.Router();
const querystring = require("querystring");
const request = require("request");
const {
  generateRandomString,
  requireToken,
} = require("../utils/authHelper");

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

// Auth-related routes
router.get("/login", function (_req, res) {
  const state = generateRandomString(16);
  const scope =
    "user-read-private user-read-email playlist-read-private user-top-read";

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});

router.get("/callback", function (req, res) {
  const code = req.query.code || null;
  const state = req.query.state || null;

  if (state === null) {
    res.redirect("http://localhost:5173/#/error");
  } else {
    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        req.session.access_token = body.access_token;
        req.session.refresh_token = body.refresh_token;

        // Redirect to Vue frontend playlists page
        res.redirect("http://localhost:5173/#/playlists");
      } else {
        res.redirect("http://localhost:5173/#/error");
      }
    });
  }
});

module.exports = router;
module.exports.requireToken = requireToken;
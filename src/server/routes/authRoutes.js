// /routes/authRoutes.js
const express = require('express');
const querystring = require('querystring');
const request = require('request');
const { client_id, client_secret, redirect_uri } = require('../config/config');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Helper function to generate random string for state
const generateRandomString = require('../utils/generateRandomString');

router.get('/login', function (req, res) {
  const state = generateRandomString(16);
  const scope = "user-read-private user-read-email playlist-read-private user-top-read";

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id,
        scope,
        redirect_uri,
        state
      })
  );
});

router.get('/callback', function (req, res) {
  const code = req.query.code || null;
  const state = req.query.state || null;

  if (state === null) {
    res.redirect('http://localhost:5173/#/error');
  } else {
    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code,
        redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(client_id + ":" + client_secret).toString("base64")}`,
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        // Update the access token in the .env file for python
        const pyEnvPath = path.join(__dirname, '../config/.env');
        let pyEnvContent = fs.readFileSync(pyEnvPath, 'utf8');
        if (pyEnvContent.includes('ACCESS_TOKEN=')) {
          pyEnvContent = pyEnvContent.replace(/ACCESS_TOKEN=".*"/, `ACCESS_TOKEN="${body.access_token}"`);
        } else {
          pyEnvContent += `\nACCESS_TOKEN="${body.access_token}"`;
        }
        pyEnvContent = pyEnvContent.replace(/ACCESS_TOKEN=".*"/, `ACCESS_TOKEN="${body.access_token}"`);
        fs.writeFileSync(pyEnvPath, pyEnvContent);
        
        // Update the access token in the .env file for node in ../../../.env
        const nodeEnvPath = path.join(__dirname, '../../../.env');
        let nodeEnvContent = fs.readFileSync(nodeEnvPath, 'utf8');
        if (nodeEnvContent.includes('ACCESS_TOKEN=')) {
          nodeEnvContent = nodeEnvContent.replace(/ACCESS_TOKEN=".*"/, `ACCESS_TOKEN="${body.access_token}"`);
        } else {
          nodeEnvContent += `\nACCESS_TOKEN="${body.access_token}"`;
        }

        access_token = body.access_token;
        refresh_token = body.refresh_token;

        res.redirect('http://localhost:5173/#/playlists');
      } else {
        res.redirect('http://localhost:5173/#/error');
      }
    });
  }
});

module.exports = router;

import express from "express";
import querystring from "querystring";
import request from "request";
import path from "path";
import fs from "fs";
import { generateRandomString } from "../utils/helpers.js";

const router = express.Router();
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = "http://localhost:3000/callback";

let access_token;
let refresh_token;

router.get("/login", (req, res) => {
  const state = generateRandomString(16);
  const scope = "user-read-private user-read-email playlist-read-private user-top-read";

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

router.get("/callback", (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;

  if (state === null) {
    res.redirect('http://localhost:5173/#/error');
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
        Authorization: "Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const envPath = path.join(__dirname, '../algorithm/python_ML/config/.env');
        let envContent = fs.readFileSync(envPath, 'utf8');
        envContent = envContent.replace(/ACCESS_TOKEN=".*"/, `ACCESS_TOKEN="${body.access_token}"`);
        fs.writeFileSync(envPath, envContent);

        access_token = body.access_token;
        refresh_token = body.refresh_token;

        res.redirect('http://localhost:5173/#/playlists');
      } else {
        res.redirect('http://localhost:5173/#/error');
      }
    });
  }
});

router.get("/api/auth-status", (req, res) => {
  res.json({ 
    isAuthenticated: !!access_token,
    hasRefreshToken: !!refresh_token
  });
});

export default router;
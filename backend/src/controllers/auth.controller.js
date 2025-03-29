import querystring from "querystring";
import request from "request";
import { generateRandomString } from "../lib/utils.js";

import dotenv from "dotenv";
dotenv.config();

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
const frontend_url = process.env.FRONTEND_URL;

export const login = (_req, res) => {
  const state = generateRandomString(16);
  const scope ="user-read-private user-read-email playlist-read-private user-top-read";

  console.log(redirect_uri);
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
};

export const callback = (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;

  if (state === null) {
    res.redirect(`${frontend_url}/#/error`);
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

        console.log("[DEBUG] Redirecting to:", `${frontend_url}/#/playlists`);
        // Redirect to Vue frontend playlists page
        res.redirect(`${frontend_url}/#/playlists`);
      } else {
        res.redirect(`${frontend_url}/#/error`);
      }
    });
  }
}
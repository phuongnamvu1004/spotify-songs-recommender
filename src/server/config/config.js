const { access } = require("fs");

module.exports = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  redirect_uri: "http://localhost:3000/callback",
  access_token: process.env.ACCESS_TOKEN,
};

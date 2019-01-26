const fs = require(`fs`);
var readline = require(`readline-sync`);
const { google } = require(`googleapis`);

const SCOPES = [`https://www.googleapis.com/auth/spreadsheets`];
const TOKEN_PATH = `./token.json`;

function authorize () {
  const credentials = require(`./credentials.json`);
  // eslint-disable-next-line camelcase
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  try {
    const token = require(TOKEN_PATH);
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
  } catch (error) {
    return getNewToken(oAuth2Client);
  }
}

function getNewToken (oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: `offline`,
    scope: SCOPES
  });
  console.log(`Authorize this app by visiting this url:`, authUrl);
  const code = readline.question(`Enter the code from that page here: `);
  oAuth2Client.getToken(code, (err, token) => {
    if (err) return console.error(`Error while trying to retrieve access token`, err);
    oAuth2Client.setCredentials(token);
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
      if (err) console.error(err);
      console.log(`Token stored to`, TOKEN_PATH);
    });
  });
  return oAuth2Client;
}

module.exports = {
  authorize
};

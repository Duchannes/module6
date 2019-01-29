const fs = require(`fs`);
var readline = require(`readline-sync`);
const { google } = require(`googleapis`);

const SCOPES = [`https://www.googleapis.com/auth/spreadsheets`];
const TOKEN_PATH = `./config/token.json`;

async function authorize () {
  const credentials = require(`./config/credentials.json`);
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

async function getNewToken (oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: `offline`,
    scope: SCOPES
  });
  console.log(`Authorize this app by visiting this url:`, authUrl);
  const code = readline.question(`Enter the code from that page here: `);
  const { tokens } = await oAuth2Client.getToken(code);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  console.log(`Token stored to`, TOKEN_PATH);
  return authorize();
}

module.exports = {
  authorize
};

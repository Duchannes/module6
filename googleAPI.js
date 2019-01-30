const { google } = require(`googleapis`);
const clientAuth = require(`./googleAuth.js`);

async function writeToSheet (data) {
  await clearSheet();
  const sheets = await getSheet();
  const request = {
    spreadsheetId: `1t4qou1upZi387mU9yWl_Uvg_7nPVf-QuQVMhDK1toaI`,
    range: `A1`,
    valueInputOption: `RAW`,
    resource: {
      values: data
    }
  };
  sheets.spreadsheets.values.update(request);
  console.log(`Data succesfully loaded to google sheet.
You can open it on: https://docs.google.com/spreadsheets/d/${request.spreadsheetId}/edit#gid=0`);
};

async function getResponseOfSheetReading (partOfResponse) {
  const sheets = await getSheet();
  const request = {
    spreadsheetId: `1t4qou1upZi387mU9yWl_Uvg_7nPVf-QuQVMhDK1toaI`,
    range: `Data`,
    valueRenderOption: `UNFORMATTED_VALUE` };
  const response = await sheets.spreadsheets.values.get(request);
  switch (partOfResponse) {
    case `data` :
      const data = await response.data.values;
      return data;
    case `code` :
      const status = await response.status;
      return status;
    default:
      console.log(`Missing argument "partOfResponse". Nothing to return`);
  }
};

async function getResponseOfSheetReadingWithWrongRange () {
  const sheets = await getSheet();
  const request = {
    spreadsheetId: `1t4qou1upZi387mU9yWl_Uvg_7nPVf-QuQVMhDK1toaI`,
    range: `List`,
    valueRenderOption: `UNFORMATTED_VALUE` };
  const response = await sheets.spreadsheets.values.get(request);
  return response;
};

async function getResponseOfSheetReadingOutOfRange (data) {
  const sheets = await getSheet();
  const request = {
    spreadsheetId: `1t4qou1upZi387mU9yWl_Uvg_7nPVf-QuQVMhDK1toaI`,
    range: `Data!A${data.length + 1}:G${data.length + 11}`,
    valueRenderOption: `UNFORMATTED_VALUE` };
  const response = await sheets.spreadsheets.values.get(request);
  return response.data.values;
};

async function getResponseOfUnauthorizedSheetReading (auth) {
  const sheets = google.sheets({ version: `v4`, auth });
  const request = {
    spreadsheetId: `1t4qou1upZi387mU9yWl_Uvg_7nPVf-QuQVMhDK1toaI`,
    range: `Data`,
    valueRenderOption: `UNFORMATTED_VALUE` };
  const response = await sheets.spreadsheets.values.get(request);
  return response.status;
};

async function clearSheet () {
  const sheets = await getSheet();
  const request = {
    spreadsheetId: `1t4qou1upZi387mU9yWl_Uvg_7nPVf-QuQVMhDK1toaI`,
    range: `Data`
  };
  sheets.spreadsheets.values.clear(request);
  console.log(`Data was succesfully deleted from sheet.`);
};

async function getSheet () {
  const auth = await clientAuth.authorize();
  const sheets = google.sheets({ version: `v4`, auth });
  return sheets;
}

module.exports = {
  writeToSheet,
  clearSheet,
  getResponseOfSheetReading,
  getResponseOfUnauthorizedSheetReading,
  getResponseOfSheetReadingOutOfRange,
  getResponseOfSheetReadingWithWrongRange
};

const { google } = require(`googleapis`);
const sheets = google.sheets(`v4`);
const fs = require(`fs`);
const path = require(`path`);

function writeToSheet (auth, data) {
  const request = {
    spreadsheetId: `1t4qou1upZi387mU9yWl_Uvg_7nPVf-QuQVMhDK1toaI`,
    range: `A1`,
    valueInputOption: `RAW`,
    resource: {
      values: data
    },
    auth: auth
  };
  sheets.spreadsheets.values.update(request, function (err, response) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Data succesfully loaded to google sheets.\nYou can open it on: https://docs.google.com/spreadsheets/d/1t4qou1upZi387mU9yWl_Uvg_7nPVf-QuQVMhDK1toaI/edit#gid=0`);
  });
};

function readSheet (auth, data) {
  const request = {
    spreadsheetId: `1t4qou1upZi387mU9yWl_Uvg_7nPVf-QuQVMhDK1toaI`,
    range: `A1:G${1 + data.length}`,
    valueRenderOption: `UNFORMATTED_VALUE`,
    dateTimeRenderOption: `FORMATTED_STRING`,
    auth: auth
  };
  sheets.spreadsheets.values.get(request, function (err, response) {
    if (err) {
      console.error(err);
      return;
    }
    const data = response.data.values;
    fs.writeFileSync(path.resolve(`./test/data.json`), JSON.stringify(data));
  });
};

module.exports = {
  writeToSheet,
  readSheet
};

const { google } = require(`googleapis`);
const sheets = google.sheets(`v4`);

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

module.exports = {
  writeToSheet
};

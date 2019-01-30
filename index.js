const mongoDB = require(`./mongoDB.js`);
const sheet = require(`./googleAPI.js`);
const fs = require(`fs`);
const path = require(`path`);

const step = process.argv[2];

async function chooseStep () {
  if (!step || typeof step !== `string`) {
    console.log(`Use: node ./index <command>`);
  } else {
    switch (step) {
      case `load`:
        mongoDB.loadDataToDB();
        break;
      case `export`:
        const data = await mongoDB.getFiltredData();
        sheet.writeToSheet(data);
        break;
      case `save`:
        const chars = await mongoDB.getChars();
        const age = await mongoDB.getAge();
        fs.writeFileSync(`chars.json`, JSON.stringify(chars));
        console.log(`Chars data file created:\n\t${path.resolve(`./chars.json`)}`);
        fs.writeFileSync(`age.json`, JSON.stringify(age));
        console.log(`Age data file created:\n\t${path.resolve(`./age.json`)}`);
        break;
      default: console.log(`Wrong command!
  Use: node ./index <command>
  List of available commands:
  load - load data to database from rickandmortyapi.com api
  export - load data from database to Google
  save - save all data from db to JSON files`);
        break;
    }
  }
}

chooseStep();

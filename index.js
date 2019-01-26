const mongoDB = require(`./mongoDB.js`);
const sheet = require(`./googleAPI.js`);
const auth = require(`./googleAuth.js`);

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
        let data = (await mongoDB.getFiltredData());
        const client = auth.authorize();
        sheet.writeToSheet(client, data);
        break;
      default: console.log(`Wrong command!
  Use: node ./index <command>
  List of available commands:
  load - load data to database from rickandmortyapi.com api
  export - load data from database to Google `);
        break;
    }
  }
}

chooseStep();

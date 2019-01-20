const MongoClient = require(`mongodb`).MongoClient;
const database = require(`./database.js`);
const mongoDB = require(`./mongoDB.js`);
const fs = require(`fs`);
const argv = require(`yargs`).argv;

const url = `mongodb://localhost:27017`;
const dbName = `hometask`;
const client = new MongoClient(url, { useNewUrlParser: true });

async function steps () {
  let step;
  client.connect(async function (err) {
    if (err) { throw err; }
    console.log(`Connected successfully to server`);
    const db = client.db(dbName);
    if (argv.load) {
      loadData(db);
      step = `load`;
    }
    if (argv.save) {
      saveData(db);
      step = `save`;
    }
    if (argv.delete) {
      deleteData(db);
      step = `delete`;
    }
    if (!step) {
      console.log(`Use "node index.js --<arg>"
      List of Args:
      load - load data from the server to the mongo data base
      save - save all data from the chars collection of mongo data base to the data.json file
      delete - delete chars collection of mongo data base`);
      client.close();
    }
  });
}

async function loadData (db) {
  const data = await database.getData();
  mongoDB.loadDataToDB(db, data, function (length) {
    client.close();
  });
};

async function deleteData (db) {
  mongoDB.dropAllData(db, function () {
    client.close();
  });
};

async function saveData (db) {
  mongoDB.getAllData(db, function (data) {
    fs.writeFileSync(`data.json`, JSON.stringify(data));
    client.close();
  });
}

steps();

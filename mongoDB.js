const database = require(`./database.js`);
const MongoClient = require(`mongodb`).MongoClient;

async function loadDataToDB () {
  const client = await getClient();
  const db = await getDB(client);

  const data = await database.getData();
  const additionalData = getAdditionalData(data.length);

  db.collection(`chars`).insertMany(data, (err) => {
    if (err) { throw err; } else {
      console.log(`Data succesfully loaded to MongoDB`);
    }
  });
  db.collection(`age`).insertMany(additionalData, (err) => {
    if (err) { throw err; } else {
      console.log(`Additional data succesfully loaded to MongoDB`);
    }
  });
  client.close();
  console.log(`Successfully disconnected from MongoDB server`);
}

function getAdditionalData (length) {
  let data = [];
  for (let i = 1; i < length + 1; i++) {
    const obj = {
      "index": i,
      "age": Math.round(100 * Math.random())
    };
    data.push(obj);
  }
  return data;
}

async function getFiltredData () {
  const client = await getClient();
  const db = await getDB(client);
  let searchResult = db.collection(`chars`).aggregate([
    {
      $lookup:
          {
            from: `age`,
            localField: `id`,
            foreignField: `index`,
            as: `ageResult`
          }
    },
    { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ `$ageResult`, 0 ] }, `$$ROOT` ] } } },
    { $project: { _id: 0, id: 1, name: 1, status: 1, species: 1, type: 1, gender: 1, age: 1 }
    },
    { $match: { $and: [ { age: { $gt: 50, $lt: 70 } }, { gender: { $not: /unknown/ } } ] } }
  ]
  ).toArray();
  client.close();
  console.log(`Successfully disconnected from MongoDB server`);
  searchResult = (await searchResult).map(element => {
    return Object.values(element);
  });
  searchResult.unshift([`Age`, `ID`, `Name`, `Status`, `Species`, `Type`, `Gender`]);
  return searchResult;
}

async function getClient () {
  const url = `mongodb://localhost:27017`;
  const client = MongoClient.connect(url, { useNewUrlParser: true });
  console.log(`Connected successfully to MongoDB server`);
  return client;
}

async function getDB (client) {
  const dbName = `hometask`;
  const db = client.db(dbName);
  return db;
}

module.exports = {
  loadDataToDB,
  getFiltredData
};

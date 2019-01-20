async function loadDataToDB (db, data, callback) {
  const collection = db.collection(`chars`);
  collection.insertMany(data, function (err, result) {
    if (err) { throw err; }
    console.log(`Inserted ${data.length} records into the collection`);
    callback(result);
  });
}

const getAllData = function (db, callback) {
  const collection = db.collection(`chars`);
  collection.find({}).toArray(function (err, data) {
    if (err) { throw err; }
    console.log(`Found the following records`);
    callback(data);
  });
};

const dropAllData = function (db, callback) {
  const collection = db.collection(`chars`);
  collection.drop({}, function (err) {
    if (err) { throw err; }
    console.log(`All data were deleted`);
    callback();
  });
};

module.exports = {
  loadDataToDB,
  getAllData,
  dropAllData
};

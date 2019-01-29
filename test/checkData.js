/* eslint-disable no-undef */
const path = require(`path`);
const chai = require(`chai`);
const expect = chai.expect;

const googleAPI = require(path.resolve(`./googleAPI.js`));
const googleAuth = require(path.resolve(`./googleAuth.js`));
const mongoDB = require(path.resolve(`./mongoDB.js`));

describe(`#check data from google sheets API`, async function () {
  it(`data shoud be the same as from database`, async function () {
    const data = await mongoDB.getFiltredData();
    const client = await googleAuth.authorize();
    await googleAPI.readSheet(client, data);
    const dbData = require(path.resolve(`./test/data.json`));
    expect(data.toString()).to.be.equal(dbData.toString());
  });
});

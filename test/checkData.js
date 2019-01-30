/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const path = require(`path`);
const chai = require(`chai`).use(require(`chai-as-promised`));
const expect = chai.expect;

const googleAPI = require(path.resolve(`./googleAPI.js`));
const mongoDB = require(path.resolve(`./mongoDB.js`));
const sheet = require(path.resolve(`./googleAPI.js`));

const statusSuccessfulResponseCode = 200;

describe(`#test of google sheets API service`, async function () {
  it(`status code corresponds to ${statusSuccessfulResponseCode}`, async function () {
    this.timeout(5000);
    const data = await mongoDB.getFiltredData();
    await sheet.writeToSheet(data);
    const statusCode = await googleAPI.getResponseOfSheetReading(`code`);
    expect(statusCode).to.be.equal(statusSuccessfulResponseCode);
  });
  it(`sheets data must be the same as the database data`, async function () {
    this.timeout(5000);
    const data = await mongoDB.getFiltredData();
    await sheet.writeToSheet(data);
    const sheetData = await googleAPI.getResponseOfSheetReading(`data`);
    expect(data.toString()).to.be.equal(sheetData.toString());
  });
  it(`request without API key must be rejected`, async function () {
    this.timeout(5000);
    expect(googleAPI.getResponseOfUnauthorizedSheetReading()).to.be.rejected;
  });
});

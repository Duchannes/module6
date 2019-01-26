const requestPromise = require(`request-promise`);

const getPagesCount = function () {
  const request = {
    method: `GET`,
    uri: `https://rickandmortyapi.com/api/character/`,
    json: true
  };
  return requestPromise(request).then(res => { return res.info.pages; });
};

const getDataOnPages = async function (pagesCount) {
  const requests = [];
  for (let i = 1; i <= pagesCount; i++) {
    const request = {
      method: `GET`,
      uri: `https://rickandmortyapi.com/api/character/?page=${i}`,
      json: true
    };
    requests.push(requestPromise(request));
  }
  const pages = await Promise.all(requests);
  const chars = pages.reduce((accum, page) => {
    return {
      results: accum.results.concat(page.results)
    };
  });
  return chars.results;
};

async function getData () {
  const pagesCount = await getPagesCount();
  const data = await getDataOnPages(pagesCount);
  console.log(`Data was succesfully loaded from API`);
  return data;
}

module.exports = {
  getData
};

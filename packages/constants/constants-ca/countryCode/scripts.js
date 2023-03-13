//  getSvg.js
// eslint-disable-next-line @typescript-eslint/no-var-requires
var fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
var path = require('path');
const DIR = path.resolve(__dirname, './countryCodeList.json');

const getCountryCodeJSON = countryCode => {
  const country = {};
  countryCode.forEach(item => {
    const first = item.country[0];
    if (country[first]) country[first].push(item);
    else country[first] = [item];
  });
  return country;
};

const countryCodeIndex = countryCode => {
  return Object.entries(getCountryCodeJSON(countryCode));
};

function readfile() {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(DIR), 'utf8', function (err, data) {
      if (err) reject(err);
      resolve(data);
    });
  });
}

readfile()
  .then(res => {
    const codeJson = getCountryCodeJSON(JSON.parse(res).countryCode);
    const codeJsonFile = JSON.stringify(codeJson);
    fs.writeFile(path.resolve(__dirname, './countryCode.json'), codeJsonFile, function (err) {
      if (err) throw new Error(err);
    });
    const codeIndex = Object.entries(codeJson);
    const codeIndexFile = JSON.stringify(codeIndex);
    fs.writeFile(path.resolve(__dirname, './countryCodeIndex.json'), codeIndexFile, function (err) {
      if (err) throw new Error(err);
    });
  })
  .catch(e => {
    console.log(e, 'error');
    throw Error(e);
  });

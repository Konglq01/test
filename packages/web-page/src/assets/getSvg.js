//  getSvg.js
// eslint-disable-next-line @typescript-eslint/no-var-requires
var fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
var path = require('path');
const svgDir = path.resolve(__dirname, './images');

function readfile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(svgDir, filename), 'utf8', function (err, data) {
      if (err) reject(err);
      resolve({
        [filename.slice(0, filename.lastIndexOf('.'))]: data,
      });
    });
  });
}

//  read all files in dir
function readSvgs() {
  return new Promise((resolve, reject) => {
    fs.readdir(svgDir, function (err, files) {
      if (err) reject(err);
      Promise.all(
        files
          .filter(filename => {
            const filenameArr = filename.split('.');
            const suffix = filenameArr[filenameArr.length - 1];
            return suffix === 'svg';
          })
          .map(filename => readfile(filename)),
      )
        .then(data => {
          resolve(data);
        })
        .catch(error => reject(error));
    });
  });
}

module.exports = {
  readfile,
  readSvgs,
};

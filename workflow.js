const http = require("http");
const https = require("https");
const querystring = require("querystring");
const path = require("path");
const fs = require("fs");
const db = path.resolve(__dirname, "db.json");

class Flow {
  constructor() {
    this.argv = process.argv[2];
  }
  log(items) {
    console.log(JSON.stringify({items}));
  }
  request(url, data = {}, opt = {}) {
    return new Promise((resolve, reject) => {
      let protocol = http;
      if (url.indexOf("https") > -1) {
        protocol = https;
      }
      let req = protocol.request(url, opt, (res) => {
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          resolve(rawData, res);
        });
      }).on('error', (err) => {
        reject(err);
      });
      req.write(querystring.stringify(data));
      req.end();
    });
  }
  get(url, data = {}, opt = {}) {
    url += "?" + querystring.stringify(data);
    return this.request(url, {}, {
      method: "GET"
    });
  }
  post(url, data = {}, opt = {}) {
    opt.method = "POST";
    return this.request(url, data, opt);
  }
  icon(img) {
    return {
      path: path.resolve(__dirname, img)
    };
  }
  getItem(key) {
    return new Promise((resolve, reject) => {
      fs.stat(db, (err, stats) => {
        if (!err) {
          let str = fs.readFileSync(db).toString();
          try {
            let data = JSON.parse(str);
            resolve(data[key]);
          } catch(e) {
            resolve();
          }
        } else {
          reject(err);
        }
      });
    })
  }
  setItem(key, value) {
    return new Promise((resolve, reject) => {
      let data;
      fs.stat(db, (err, stats) => {
        if (!err) {
          let str = fs.readFileSync(db);
          try {
            data = JSON.parse(str);
          } catch(e) {
            data = {};
          }
        }
        data[key] = value;
        data = JSON.stringify(data, null, "\t");
        fs.writeFile(db, data, (err) => {
          if (err) {
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });
    });
  }
}

module.exports = Flow;
const Flow = require("./workflow");
const flow = new Flow();

const getFund = (code) => {
  return new Promise((resolve, reject) => {
//    let url = `http://fund.eastmoney.com/${code}.html`;
    let timestamp = new Date().getTime();
    let url = `http://fundgz.1234567.com.cn/js/${code}.js?rt=${timestamp}`;
    flow.get(url)
    .then((body) => {
      function jsonpgz(obj) {
        let title = obj.name + "(" + obj.fundcode + ")";
        let subtitle = obj.gszzl + "%";
        if (obj.gszzl > 0) {
          icon = flow.icon("up.png");
        } else {
          icon = flow.icon("down.png");
        }
        if (title && subtitle) {
          resolve({
            title,
            subtitle,
            icon,
            arg: `http://fund.eastmoney.com/${code}.html`
          });
        } else {
          reject();
        }
      }
      eval(body);
//      let title = "";
//      let subtitle = "";
//      let icon = {};
//      const reg1 = /<div class="fundDetail-tit"><div style="float: left">(.+?)<span>\(<\/span><span class="ui-num">(.+?)<\/span><\/div>\)<\/div>/;
//      const reg2 = /<span class="ui-font-middle.+?ui-num" id="gz_gszzl">(.+?)<\/span>/;
//      let matches1 = body.match(reg1);
//      if (matches1 && matches1.length > 1) {
//        title = matches1[1] + "(" + matches1[2] + ")";
//      }
//      let matches2 = body.match(reg2);
//      if (matches2 && matches2.length > 0) {
//        subtitle = matches2[1];
//      }
//      if (subtitle.indexOf("+") > -1) {
//        icon = flow.icon("up.png");
//      } else {
//        icon = flow.icon("down.png");
//      }
//      if (title && subtitle) {
//        resolve({
//          title,
//          subtitle,
//          icon,
//          arg: `http://fund.eastmoney.com/${code}.html`
//        });
//      } else {
//        reject();
//      }
    }).catch((err) => {
      reject();
    });
  });
}

flow.getItem("jj")
  .then((data) => {
    if (data && data.length > 0) {
      let arr = [];
      data.forEach((code) => {
        arr.push(getFund(code));
      });
      Promise.all(arr).then((data) => {
        flow.log(data);
      })
      .catch((err) => {
        flow.log([{
          title: '暂无数据'
        }]);
      });
    }
  });
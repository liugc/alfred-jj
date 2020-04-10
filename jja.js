const Flow = require("./workflow");
const flow = new Flow();

const getFund = () => {
  flow.get(`http://fund.eastmoney.com/${flow.argv}.html`)
    .then((body) => {
      let title = "";
      let subtitle = "";
      let icon = {};
      const reg1 = /<div class="fundDetail-tit"><div style="float: left">(.+?)<span>\(<\/span><span class="ui-num">(.+?)<\/span><\/div>\)<\/div>/;
      const reg2 = /<span class="ui-font-middle.+?ui-num" id="gz_gszzl">(.+?)<\/span>/;
      let matches1 = body.match(reg1);
      if (matches1 && matches1.length > 1) {
        title = matches1[1] + "(" + matches1[2] + ")";
      }
      let matches2 = body.match(reg2);
      if (matches2 && matches2.length > 0) {
        subtitle = matches2[1];
      }
      if (subtitle.indexOf("+") > -1) {
        icon = flow.icon("up.png");
      } else {
        icon = flow.icon("down.png");
      }
      if (title && subtitle) {
        flow.log([{
          title,
          subtitle,
          icon,
          arg: flow.argv
        }]);
      } else {
        flow.log([{
          title: '暂无数据'
        }]);
      }
    }).catch((err) => {
      flow.log([{
        title: '暂无数据'
      }]);
    });
}

console.error(flow.argv);

getFund();
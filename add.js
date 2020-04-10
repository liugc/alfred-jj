const Flow = require("./workflow");
const flow = new Flow();

flow.getItem("jj")
  .then((data) => {
    if (data && data.length > 0) {
      if (!data.includes(flow.argv)) {
        data.push(flow.argv);
      }
    } else {
      data = [flow.argv];
    }
    flow.setItem("jj", data);
  });
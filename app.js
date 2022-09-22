const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();
const fs = require("fs");
const path = require("path"); //系统路径模块

const port = 3100;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//设置允许跨域访问该服务.
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

let config;
const msg = {
  code: 200,
  msg: "success",
};
const file = path.join(__dirname, "data/config.json"); //文件路径，__dirname为当前运行js文件的目录
fs.readFile(file, "utf8", function (err, data) {
  if (err) console.log(err);
  config = JSON.parse(data); //读取的值
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/config", (req, res) => {
  res.send(config);
});

const arrRemoveJson = (arr, attr, value) => {
  if (!arr || arr.length == 0) return "";
  let newArr = arr.filter((item, index) => item[attr] !== value);
  return newArr;
};

app.post("/config/edit", (req, res) => {
  if (!!req.body.title) {
    for (let i = 0; i < config.items.length; i++) {
      if (config.items[i].id === req.body.id) {
        config.items[i].title = req.body.title;
        config.items[i].link = req.body.link;
      }
    }
    const content = JSON.stringify(config);
    fs.writeFile(file, content, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("文件编辑成功");
    });
    res.send(msg);
  }
});

app.post("/config/add", (req, res) => {
  if (!!req.body.id && !!req.body.title) {
    config.items.push(req.body);
    const content = JSON.stringify(config);
    fs.writeFile(file, content, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("标签添加成功");
    });
    res.send(msg);
  }
});

app.post("/config/del", (req, res) => {
  if (!!req.body.id) {
    config.items = arrRemoveJson(config.items, "id", req.body.id);
    const content = JSON.stringify(config);
    fs.writeFile(file, content, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("标签删除成功");
    });
    res.send(msg);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const express = require("express");

const port = 8080;  //端口
const yijieLoginURL = "http://sync.1sdk.cn/login/check.html?";

const app = express();

app.get("/checkUserLogin", (req, res) => {
    console.log("req checkUserLogin");
    res.send("res checkUserLogin");
});

app.get("/orderCallBack", (req, res) => {
    console.log("req orderCallBack");
    res.send("res orderCallBack");
});

app.listen(port, () => console.log("listen on port", port));
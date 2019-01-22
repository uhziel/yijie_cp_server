const express = require("express");
const request = require("request");
const md5 = require("blueimp-md5");
const mysql = require("mysql");

const privateKey="2KFYOFV4QLWXWW7X7L09R99PPE13YCEV"; //App的同步密钥
const port = 8000;  //端口
const yijieLoginURL = "http://sync.1sdk.cn/login/check.html";
const requestTimeout = 1500;    //请求超时。单位：毫秒。

const mysqlHost = "localhost";
const mysqlUser = "cp_user";
const mysqlPassword = "FRMULy2FBzhcCc";
const mysqlDatabase = "pay";

const app = express();

app.get("/checkUserLogin", (req, res) => {
    const q = req.query;
    let uri = `${yijieLoginURL}?$sdk=${q.sdk}&app=${q.app}&uin=${q.uin}&sess=${q.sess}`;
    request.get(uri, {timeout: requestTimeout}, (err, _, body) => {
        if (err) {
            res.send(1);
            console.log("http get fail, err_code:", err.code);
            return;
        }

        res.send(body);
    });
});

app.get("/orderCallBack", (req, res) => {
    //校验数据来自于支付服务器而不是恶意第三方
    const serverSign = getServerSign(req.query);
    if (serverSign !== req.query.sign) {
        res.send("FAIL");
        return 
    }

    //插入数据库
    let order = convert2Order(req.query);
    let query = connection.query("INSERT IGNORE INTO orders SET ?", order, function (error, results, fields) {
        if (error) {
            console.log(error);
            return;
        }
    });
    console.log("execute sql:", query.sql);

    res.send("SUCCESS");
});

app.get("/syncPayResult", (req, res) => {
    const q = req.query;
    let uri = `${yijieLoginURL}?$sdk=${q.sdk}&app=${q.app}&uin=${q.uin}&sess=${q.sess}`;
    request.get(uri, {timeout: requestTimeout}, (err, _, body) => {
        if (err) {
            res.send([]);
            console.log("http get fail, err_code:", err.code, " q:", q);
            return;
        }

        if (body != 0) {
            res.send([]);
            console.log("checkUserLogin fail", q);
            return; 
        }
        //TODO uin是否就是uid
        let query = connection.query(`CALL syncPayResult(?, ?, ?);`,
            [q.sdk, q.app, q.uin], 
            function (error, results, fields) {
                if (error) {
                    console.log(error);
                    return;
                }
                const json = JSON.stringify(results[0]);
                res.send(json);
            });
        console.log("execute sql:", query.sql);   
    });
});

app.listen(port, "0.0.0.0", () => console.log("listen on port", port));

const connection = mysql.createConnection({
    host     : mysqlHost,
    user     : mysqlUser,
    password : mysqlPassword,
    database : mysqlDatabase
});

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);
});

function getServerSign(query) {
    let str = `app=${query.app}`;
    str += `&cbi=${query.cbi}`;
    str += `&ct=${query.ct}`;
    str += `&fee=${query.fee}`;
    str += `&pt=${query.pt}`;   //TODO 是否传入是毫秒级的
    str += `&sdk=${query.sdk}`;
    str += `&ssid=${query.ssid}`;
    str += `&st=${query.st}`;
    str += `&tcd=${query.tcd}`;
    str += `&uid=${query.uid}`;
    str += `&ver=${query.ver}`;
    str += privateKey;
    return md5(str);
}

function convert2Order(query) {
    let order = {};
    order.app = query.app;
    order.cbi = query.cbi;
    order.ct = new Date(query.ct * 1000);
    order.fee = parseInt(query.fee, 10);
    order.pt = new Date(query.pt * 1000);
    order.sdk = query.sdk;
    order.ssid = query.ssid;
    order.st = parseInt(query.st, 10);
    order.tcd = query.tcd;
    order.uid = query.uid;
    order.ver = query.ver;
    order.taked = 0;

    return order;
}

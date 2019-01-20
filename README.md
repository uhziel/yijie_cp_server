# yijie_cp_server
易接 SDK CP 服务器。实现了两个接口，一个是登陆验证接 口，一个是消费记录同步接口。

## API

hostname 为 yijie_cp_server 所在外网地址

### 接口：同步支付结果（由游戏客户端使用）

描述：当客户端付费成功后，调用该接口，返回结果为应生效的订单记录，客户端用以发对应道具。由于在第三方付费成功后，不一定会立即生成订单记录。建议没获取到订单时，可以隔3秒再尝试一次，或者重新打开游戏付费界面时再请求次。

请求地址：http://hostname:8000/syncPayResut

请求方式：GET

参数描述：

同[易接登陆验证接口](https://www.1sdk.cn/omsdk-sdkenter-online/omsdk-sdkenter-server1/omsdk-sdkenter-server-joggle.html#_Toc467157845)

返回值：

`
[
    {cbi: "CIB123456", fee: 100},
    {cbi: "CIB123456", fee: 102}
]
`

返回结果以JSON展示。返回应生效订单记录，可能为空。
cbi、fee 含义见 [消费记录同步接口](https://www.1sdk.cn/omsdk-sdkenter-online/omsdk-sdkenter-server1/omsdk-sdkenter-server-consume.html#_Toc467158561)。

### 接口：付费成功回调(填入易接支付回调地址即可)

描述：该接口客户端不用使用。易接支付通过调用它，告知CP服务器订单记录。

请求地址：http://hostname:8000/orderCallBack

请求方式：GET
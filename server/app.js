const fs = require('fs')
const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const dataSavePath = path.join(__dirname, "data") // 数据文件的存储位置

const urlencodedParser = bodyParser.urlencoded({ extended: false })

// @description 访问静态资源, 主要是geojson
app.use("/static", express.static(path.join(dataSavePath)))


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.use(bodyParser.json())
app.use("/csy", require("./router/router.js")) // API Router 路由管理

let server = app.listen(8081, function () {
  let host = server.address().address
  let port = server.address().port
  console.log(`访问地址为: http://${host}:${port}`)
})

const express = require('express')
const api = express.Router() // API Router
const path = require('path')
const bodyParser = require('body-parser')
const fs = require('fs')

const app = express()
const dataSavePath = path.join(__dirname, "../data") // 数据文件的存储位置
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const successSign = "success" // 返回 成功 标识
const falseSign = 'error' // 返回 失败 标识

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})
app.use(bodyParser.json())

api.post("/createUserCount", urlencodedParser, (req, res) => {
  let userId = req.body.userId
  let userIdFilePath = path.join(dataSavePath, userId + "")
  existDirectoryPath(userIdFilePath)
  .then((fPath) => makeDirectoryPath(fPath), (fPath) => console.log(`文件夹已存在${fPath}`))
  .then((fPath) => copyFile(path.join(dataSavePath, "广东行政区划简图.json"), path.join(fPath, "广东行政区划简图.json")), (err) => console.log(`复制文件时发生错误${fPath}`))
  .then(() => myResponse(res, successSign), () => myResponse(res, falseSign))
})

function makeDirectoryPath (userPath) { // 创建文件夹
  let p = new Promise((resolve, reject) => {
    fs.mkdir(userPath, function (error) {
      if (error) {
        reject(userPath) // console.log("创建文件夹时错误：\n", error)
      }
      resolve(userPath)
    }) 
  })
  return p
}

function existDirectoryPath (userPath) { // 是否存在文件夹 --同步
  let p = new Promise((resolve, reject) => {
    fs.exists(userPath, function (exists) {
      if (exists) {
        reject(userPath) // 存在文件夹
      }
      if (!exists) {
        resolve(userPath) // 不存在, 创建文件夹
      }
    })  
  })
  return p
}

function copyFile (fromPath, targetPath) {
  let p = new Promise((resolve, reject) => {
    fs.readFile(fromPath, function(err, data) {
      if (err) {
	      console.log("复制文件时错误")
        reject()
      } else {
        fs.writeFile(targetPath, data, function (err) { // 写入文件
          if (err) {
            console.log("复制文件时错误")
            reject()
          } else {
            resolve() 
          }
        })
      }
    })
  })
  return p
}

function myResponse (res, str) { 
  res.send(str + "") // 返回值不能是整数
  return
}

module.exports = api
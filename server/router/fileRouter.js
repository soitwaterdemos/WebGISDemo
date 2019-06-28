let executePy = require("./executePy.js")
let exec = require("child_process").exec
const fs = require('fs')
const express = require('express')
const app = express()
let api = express.Router() // API Router
const path = require('path')
const bodyParser = require('body-parser')
const unzip = require('unzip') // 解压zip文件的包
const formidable = require('formidable') // 读取表单的包

const urlencodedParser = bodyParser.urlencoded({ extended: false })
const dataSavePath = path.join(__dirname, "../data") // 数据文件的存储位置
const successSign = "success" // 返回 成功 标识
const falseSign = 'error' // 返回 失败 标识

api.post("/executeFile", urlencodedParser, function (req, res) {
  let names = req.body.fileNames
  let operation = req.body.operation
  let userId = req.body.userId
  let nameList = names.split("__csycsy__")
  for (let i = 0;i < nameList.length; i++) {
    console.log("mingzi -- ", nameList[i])
    nameList[i] += ".shp"
  }
  let aPath = path.join(dataSavePath, userId, nameList[0])
  let bPath = path.join(dataSavePath, userId, nameList[1])
  let cPath = path.join(dataSavePath, userId, "intersect.shp")
  if (operation === "intersect") {
    exec('python intersect.py '+ aPath + ' ' + bPath + ' ' + cPath, function (error,stdout,stderr) {
      if(error) {
        console.log(error)
      } else {
        console.log("成功相交 from intersectPy.js")
      }
    })
  }
})

api.get("/downloadFile/:userId/:fileName", urlencodedParser, function (req, res) {
  let userId = req.params.userId + ""
  let fileName = req.params.fileName + ".json"
  let jsonFilePath = path.join(dataSavePath, userId, fileName) // data/15555555555/广东.json
  res.set({
    'Content-Type': 'application/octet-stream', //告诉浏览器这是一个二进制文件
    'Content-disposition': 'attachment; filename=jsonFile',  //告诉浏览器这是一个需要下载的文件
  })
  res.download(jsonFilePath)
})

// api.post('/readjson', urlencodedParser, function (req, res) {
//   let userId  = req.body.userId
//   let fileName = req.body.fileName
//   let originShpFilePath = path.join(dataSavePath, userId, fileName)
//   originShpFilePath = originShpFilePath.replace(/\\/g,"/") 
  
//   readJSON(originShpFilePath)
//   .then((data) =>  myResponse(res, data), () => myResponse(res, falseSign)) // 使用 json 对象
// })

api.post('/shp2json', urlencodedParser, function (req, res) {
  let userId  = req.body.userId
  let fileName = req.body.fileName
  let originShpFilePath = path.join(dataSavePath, userId, fileName)
  originShpFilePath = originShpFilePath.replace(/\\/g,"/") 
  
  let url = "/api/static/" + userId + "/" + fileName.substring(0, fileName.length - 4) + ".json"
  executePy.shp2JSON(originShpFilePath)
  .then((jsonFilePath) => readJSON(jsonFilePath), () => myResponse(res, falseSign))
  .then((data) =>  myResponse(res, data), () => myResponse(res, falseSign)) // 使用 json 对象
  // .then(() =>  myResponse(res, url), () => myResponse(res, falseSign)) // 使用url
})

api.post('/uploadFile/:userId/:fileName', urlencodedParser, function (req, res) {
  let userId = req.params.userId
  let fileName = req.params.fileName
  let userFilePath = path.join(dataSavePath, userId + "") // data/用户id
  let newFilePath = path.join(userFilePath, fileName + "")// data/用户id/文件名.shp
  console.log("79,",userFilePath, newFilePath)

  
  saveFile(req, userFilePath)
  .then((tempFilePath) => changeFileName(tempFilePath, newFilePath), (msg, err) => outputErrorMsg (msg, err)) 
  .then(() =>  myResponse(res, successSign), () => myResponse(res, falseSign))
})

module.exports = api

// 输出错误信息
function outputErrorMsg (msg, err) {
  console.log (`Error:\n${msg}\n详细信息${err}`)
}

// express不允许在一个router里使用两次res.send, 所以放到一个函数里避免检查
function myResponse (res, data) { 
  res.send(data) 
  return
}

// 读取json文件
function readJSON (jsonPath) {
  let p = new Promise((resolve, reject) => {
    fs.readFile(jsonPath, 'utf8', function (err,data) {
      if (err) {
        console.log('读取JSON文件错误 --> ',err)
        reject(err)
      }
      resolve(JSON.stringify(data))
    })
  })
  return p
}

// 保存用户上传的shp文件,并获取用户id，文件id等信息（便于后续创建用户文件夹，用户文件id文件夹）
function saveFile (req, userPath) {
  let p = new Promise((resolve, reject) => {
    let form = new formidable.IncomingForm() // 表单 
    form.uploadDir = userPath
    form.parse(req, function(err, fields, files) { // 下面的方法是异步的? 且作用是将获取表单数据--将文件保存到本地
      if (err) {
		    let msg = "保存文件时错误."
	      reject (msg, err)
	    } else {
        console.log("123, ", "\n", files.file)

        let tempFileName = files.file.path // 绝对路径 + 临时文件名(无后缀)
		    resolve(tempFileName) 
	    }
    })
  })
  return p
}

// 改名
function changeFileName (tempFilePath, newFilePath) { 
  let p = new Promise((resolve, reject) => {
	  fs.rename(tempFilePath, newFilePath, function (err) {
	    if (err) {
		    let msg = "保存文件后改名错误."
	      reject(msg, err)
	    } else {
		    resolve(newFilePath)
	    }
    })
  })
  return p
}


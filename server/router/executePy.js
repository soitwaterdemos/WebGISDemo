let exec = require("child_process").exec
let path = require("path")
// 流程
// 改变坐标系，并将其保存为：原名字+"1"
// 对 原名字+"1" 执行：计算自然等指数，计算自然等，计算利用等指数，计算利用等，计算经济等指数，计算经济等
// 对 原名字+"1" 执行：删除多余字段，添加 name 字段，准备计算字段
// name字段为 自然等， 转出 geojson（名字 "zr"）
// name字段为 利用等， 转出 geojson（名字 "ly"）
// name字段为 经济等， 转出 geojson（名字 "jj"）

module.exports = {
  changeGrid: (sourceShpPath) => { // 调用修改坐标(修改后的shp的保存路径不能与原文件路径一样)
    return new Promise((resolve, reject) => {
      let targetShpPath = sourceShpPath.substring(0, sourceShpPath.length - 4) + "csycsy" + ".shp" // 约定“csycsy” 作为标记
      exec('python coordinate.py '+ sourceShpPath + ' ' + targetShpPath + '', function (error,stdout,stderr) {
        if(error) {
          console.log(error)
          reject(error)
        } else {
          console.log("成功转换坐标系 from executePy.js")
          resolve(targetShpPath) // 若修改坐标系成功 则返回修改后的shp的文件路径
        }
      })
    })
  },
  shp2JSON: (sourceShpPath) => {
    let pathWithoutType = sourceShpPath.substring(0, sourceShpPath.length - 4)
    let jsonFilePath = pathWithoutType + ".json"
    let cmd = " mapshaper " + sourceShpPath + " -o " + jsonFilePath + " format=geojson"
    return new Promise((resolve, reject) => {
      exec(cmd, function (error,stdout,stderr) {
        if(error) {
          console.log(error)
          reject(error)
        } else {
          // console.log('根路径 ',path.join(__dirname));
          resolve(jsonFilePath) // 若修改坐标系成功 则返回修改后的shp的文件路径
        }
      })
    })
  },
  changeTwoFilesName (hasCsyFilePath, noneCsyFilePath) {
    let tempFileName = Number(new Date()) + ""
    return newPromise((resolve, reject) => {
      fs.rename(noneCsyFilePath, tempFileName, function (err) {
          if (err) {
            console.log("保存文件后改名错误.")
            reject(err)
          } else {
            fs.rename(hasCsyFilePath, noneCsyFilePath, function (err2) {
              if (err2) {
                console.log("保存文件后改名错误.")
                reject(err2)
              } else {
                resolve()
              }
            })
          }
      })
    })
  }, 
}

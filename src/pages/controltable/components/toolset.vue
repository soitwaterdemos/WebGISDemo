<template>
  <div id="main-controltable-toolset">
    <div class="main-controltable-toolset-tools">
      <div class="iconfont control-table-font" id="upload-file" title="上传shapefile文件" @click="uploadFile($event)">&#xe78a;</div>
    </div>
    <div class="main-controltable-toolset-tools">
      <div class="iconfont control-table-font" id="new-file" title="隐藏图层" @click="cleanAllLayers($event)">&#xe626;</div>
    </div>
    <div class="main-controltable-toolset-tools" title="背景颜色">
      <el-color-picker
        id="change-bgcolor" size="medium"
        v-model="bgColor" show-alpha @change="changGlobalValueBgColor">
      </el-color-picker>
    </div>
    <div class="main-controltable-toolset-tools" id="change-mapcolor" title="高亮颜色">
      <el-color-picker
        id="change-mapcolor" size="medium"
        v-model="mapColor" show-alpha @change="changGlobalValueMapColor">
      </el-color-picker>
    </div>
    <input style="width:0;height:0;opacity:0;" type="file" ref="uploadFileBtn" name="uploadFile" 
      @change="uploadFileFunction()" 
      accept=".shp,.shx,.sbx,.sbn,.prj,.dbf,.json, .zip" multiple/>
  </div>
</template>

<script>
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js'

import api from "@/api/api.js"
import bus from "@/api/bus.js"
import store from "@/api/store.js"
import qs from "qs"
import shp from "shpjs"

export default {
  name: "ToolSet",
  data () {
    return {
      map: store.state.openlayers.map, // 地图
      bgColor: "rgb(80, 80, 80)",
      // mapColor: "rgba(129, 129, 129, 0.9)",
      mapColor: "rgba(16, 164, 226, .8)",
      showOrHideLayers: "hide",
    }
  },
  methods: {
    cleanAllLayers (e) {
      let target = e.target
      try {
        if (this.showOrHideLayers === "hide") { // 隐藏
          target.innerHTML = "&#xe648;"
          this.showOrHideLayers = "show"
          target.title = "显示图层"
          bus.$emit("cleanAllLayers")
        } else if (this.showOrHideLayers === "show") { // 显示
          target.innerHTML = "&#xe626;"
          this.showOrHideLayers = "hide"
          target.title = "隐藏图层"
          bus.$emit("showAllLayers")
        }
      } catch (error) {

      }
    },
    changGlobalValueBgColor () {
      let main = document.getElementById("main-openlayers")
      main.style.background = this.bgColor
    },
    changGlobalValueMapColor () { // 改变高亮颜色
      let color = this.getLightColor(this.mapColor, 1)
      store.state.openlayers.selectedStyle = new Style({ // 选中时地图高亮样式 (可被fillcolor.vue修改)
        stroke: new Stroke({
          color: this.getLightColor(color, 0.9),
          width: 1.5,
        }),
        fill: new Fill({
          color: this.getLightColor(color, 0.4),
        }),
        image: new CircleStyle({
          radius: 8,
          fill: new Fill({
            color: this.getLightColor(color, 0.9),
          }),
        }),
      })
      // let map = store.state.openlayers.map
      // let layers = map.getLayers().getArray()
      // for (let layer of layers) {
      //   try {
      //     layer.getStyle().getFill().setColor(this.mapColor) // 会修改图层颜色
      //   } catch (err) {
      //     continue
      //   }
      // }
    },
    getLightColor (value, power) { // 色彩透明度
      let arr = value.split(",")
      let num = parseFloat(arr[arr.length - 1])
      arr.pop()
      arr.push(" " + num * power + ")")
      let result = arr.join()
      return result
    },
    checkFileType (fileName) { // 检查文件类型
      let fileType = fileName.substring(fileName.length - 3)
      if (fileType === 'shp' || fileType === "shx" || fileType === "sbx" || fileType === "sbn" || fileType === "prj" || fileType === "dbf") {
        return true
			} else {
        // if (fileName.substring(fileName.length - 4) === "json") { // 假如是 "json" 格式, 也支持
        //   return true
        // }
        return false
      }
    },
    uploadFileFunction () { // 打开上传文件菜单
      if (store.state.globalValue.tableData.length >= 3) {
        this.msg("warning", "文件数量超出上限", `每位用户最多上传2份文件`)
        return 
      }
			let input = this.$refs.uploadFileBtn
			if (input.files.length === 0) { // 点击了“取消按钮” -- 文件为空时，不发送post请求
        return
      }

      let files = input.files // 文件列表
      let shpFileName = ""// 记录shp文件的文件名

      let file0Name = files[0].name // 上传的是 json 文件情况如下 (编码错误)
      if (files.length === 1 && file0Name.substring(file0Name.length - 4) === "json") { 
        let file0NameWithout = file0Name.substring(0, file0Name.length - 5) // 无后缀文件名
        store.state.globalValue.tableData.push({ // 给 el-表格 填充文件名
          name: file0NameWithout
        })
        store.state.globalValue.jsonFileName.push(file0NameWithout)
        let reader = new FileReader()
        reader.readAsText(files[0]) // 读取文件的内容
        reader.onload = function () { // 当读取完成之后会回调这个函数，然后此时文件的内容存储到了result中。直接操作即可
          let json = JSON.parse(this.result)
          store.commit("updateGeoJsonUrl", json)
        }
        return 
      }
      
      if (files.length === 1 && file0Name.substring(file0Name.length - 3) === "zip") { // 上传的是.zip
        let file0NameWithout = file0Name.substring(0, file0Name.length - 4) // 无后缀文件名
        store.state.globalValue.tableData.push({ // 给 el-表格 填充文件名
          name: file0NameWithout
        })
        store.state.globalValue.zipFileName.push(file0NameWithout)
        let reader = new FileReader()
        // console.log("151", files[0], files[0].weblitRelativePath)
        reader.readAsArrayBuffer(files[0]) // 读取文件的内容
        reader.onload = function () { // 当读取完成之后会回调这个函数，然后此时文件的内容存储到了result中。直接操作即可
          // console.log('result\n', this.result)
          shp(this.result).then(function(geojson){
            store.commit("updateGeoJsonUrl", geojson)
          })
        }
        return 
      }

      let that = this
      for (let i = 0;i < files.length;i++) { // 上传的是shapefile 文件情况如下
        if (!that.checkFileType(files[i].name)) { // 文件类型错误
          that.msg("warning", `文件${files[i].name}类型错误.\n请上传支持的文件类型: .shp,.shx,.sbx,.sbn,.prj,.dbf, .json`, ``)
          return
        } else {
          if (files[i].name.substring(files[i].name.length - 3) === "shp") { // 给 el-表格 填充文件名
            shpFileName = files[i].name
            store.state.globalValue.tableData.push({
              name: shpFileName.substring(0, shpFileName.length - 4)
            })
          }
          let param = new FormData() // 创建form对象
          param.append("file", files[i]) // 通过append向form对象添加数据

          api.uploadFile(store.state.userId, files[i].name, param)
          .then (res => {
			    	if (res.data === "success") {
              if (i === files.length - 1) { // 说明文件已经上传完毕, 
                let data = {
                  userId: store.state.userId,
                  fileName: shpFileName,
                } 
                api.shp2json(qs.stringify(data)) // 通知可以将shp转为json了
                .then((req) => {
                  // console.log("84 地图json\n", req.data)
                  let geoJsonUrl = req.data
                  store.commit("updateGeoJsonUrl", geoJsonUrl)
                })
                .catch()
              }
			    	}
          })
          .catch ( err => {
            // console.log (`文件上传失败 --> \n ${err}`)
            that.msg("warning", `文件${files[i].name}上传失败.`, "")
			    })
        }
      }
    },
    uploadFile (e) { // 触发真正的 input 按钮
      e.preventDefault()
      this.$refs.uploadFileBtn.click()
    },
    msg (type, title, message) {
      this.$notify({
        type: type,
        title: title,
        message: message,
        duration: "3000",
      })
    },
  },
  mounted () {

  },
}
</script>

<style scoped>
#main-controltable-toolset {
  width: 10%;
  height: 100%;
  box-sizing: border-box;
  /* border-right: .01rem solid rgb(42, 42, 42); */
  display: flex;
  flex-flow: wrap row;
}
.main-controltable-toolset-tools {
  width: 50%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  border-right: .01rem solid rgb(42, 42, 42);
  border-top: .01rem solid rgb(42, 42, 42);
}
.main-controltable-toolset-tools .iconfont:hover {
  color: rgba(16, 164, 226, .8);
}
.main-controltable-toolset-tools .iconfont {
  width: .36rem;
  height: .36rem;
  font-size: .3rem;
  text-align: center;
  line-height: .36rem;
  color: rgba(129, 129, 129, 0.9);
}
.main-controltable-toolset-tools #change-bgcolor {
  width: .36rem;
  height: .36rem;
}
/* .main-controltable-toolset-tools #new-file { */
  /* font-size: .24rem; */
/* } */
/* 手机 */
@media  screen and (max-width: 800px) { 
  #main-controltable-toolset {
    width: calc((100% - .2rem) / 2);
    height: 50%;
    position: absolute;
    left: .2rem;
    top: 50%;
  }
}
</style>

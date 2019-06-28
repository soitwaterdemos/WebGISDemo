<template>
  <div id="main-controltable-download">
    <el-tooltip placement="top">
      <div slot="content">
        网页临摹: https://pixelmap.amcharts.com/#
        <br/>
        本网页仅作个人练习使用.
        <br/>
        个人邮箱: kisscsy@foxmail.com
      </div>
      <el-button class="element-button" size="mini" @click="showAuthorMsg()">About&nbsp;Author</el-button>
    </el-tooltip>
    <div class="footer">
      <el-button class="element-button-footer" size="mini" icon="el-icon-download" @click="downloadJson">JSON</el-button>
      <el-button class="element-button-footer" size="mini" icon="el-icon-download">CODE</el-button>
    </div>
  </div>
</template>

<script>
import store from "@/api/store.js"
import api from "@/api/api.js"
import qs from "qs"
// import saveAs from "@/assets/publicjs/FileSaver.js"

export default {
  name: "Download",
  data () {
    return {
    }
  },
  methods: {
    downloadJson () {
      let globalOpenlayerValue = store.state.globalValue 
      // let param = {
      //   "userId": store.state.userId, 
      //   "fileName": globalOpenlayerValue.tableData[globalOpenlayerValue.currentVisibleLayerIndex].name
      // }
      let fileName = globalOpenlayerValue.tableData[globalOpenlayerValue.currentVisibleLayerIndex].name
      for (let item of store.state.globalValue.jsonFileName) {
        if (fileName === item) {
          this.msg(`Json文件不会上传服务器, 请在个人设备上查找文件 ${fileName}.json`, "下载错误")
          return 
        }
      }

      for (let item of store.state.globalValue.zipFileName) {
        if (fileName === item) {
          let data = store.state.openlayers.geoJsonUrl[globalOpenlayerValue.currentVisibleLayerIndex]
          var content = JSON.stringify(data);
          var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
          saveAs(blob,  fileName + ".json")
          return 
        }
      }
      
      let url = 'http://localhost:8081/csy' + "/file/downloadFile/" + store.state.userId + "/" + fileName
      console.log("注意部署时修改 download.vue 的地址前缀", url)
      window.open(url)
    },
    showAuthorMsg () {
      this.msg('网页临摹: https://pixelmap.amcharts.com/#', `本网页仅作个人练习使用`)
    },
    msg (text, title) {
      this.$alert(text, title, {
        confirmButtonText: '确定',
        callback: action => {
        }
      });
    },
  },
}
</script>

<style scoped>
#main-controltable-download {
  width: 40%;
  height: 100%;
  display: flex;
  flex-flow: wrap row;
  justify-content: center;
  align-content: space-around;
  /* background: purple; */
}
#main-controltable-download .element-button {
  width: 90%;
  height: 45%;
  background: rgba(16, 164, 226, .8);
  color: #fff;
  font-size: .24rem;
}
#main-controltable-download .footer {
  height: 40%;
  width: 90%;
  display: flex;
  flex-flow: nowrap row;
  justify-content: space-around;
  align-items: center;
  /* background: red;   */
}
#main-controltable-download .footer .element-button-footer {
  height: 60%;
  width: 40%;
  color: #8e8e8e;
  /* background: #2d2d2d; */
}
/* 手机 */
@media  screen and (max-width: 800px) { 
  #main-controltable-download {
    --width: calc((100% - .2rem) / 2);
    width: var(--width);
    height: 50%;
    position: absolute;
    left: calc(.2rem + var(--width));
    top: 50%;
  }
  #main-controltable-download .element-button {
    font-size: .14rem;
  }
  #main-controltable-download .footer {
    flex-flow: nowrap column;
    /* justify-content: center; */
    /* align-items: center; */
  }
  #main-controltable-download .footer .element-button-footer {
    height: 40%;
    width: 80%;
    font-size: .02rem;
    margin: 0;
  }
}
</style>

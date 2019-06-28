<template>
  <div id="main-controltable-tooldetail">
    <div class="title">Operation</div>
    <div class="container">
      <div class="second-title">Tools</div>
      <el-cascader 
        class="element-cascader"
        expand-trigger="hover"
        :options="toolsOptions"
        v-model="selectedOptions"
        @change="handleChange">
      </el-cascader>
    </div>
    <div class="footer">
      <el-button class="element-button" id="tooldetail-executeBtn" size="mini" :loading="executeLoading" @click="executeFile" disabled>{{executeLoadingContent}}</el-button>
      <!-- <el-checkbox class="element-checkbox" v-model="checkedBoxChecked">Show&nbsp;Result</el-checkbox> -->
    </div>
  </div>
</template>

<script>
import store from "@/api/store.js"
import api from "@/api/api.js"
import bus from "@/api/bus.js"
import qs from "qs"
// import {polygon, intersect} from "@turf/turf"

export default {
  name: "ToolDetail",
  data () {
    return {
      executeBtnDisabled: false, // "执行"按钮的可用性
      toolsOptions: [{
        value: 'Polygon',
        label: 'Polygon',
        children: [{
          value: 'intersect',
          label: 'intersect'
        }, {
          value: 'difference',
          label: 'difference'
        }]
      }, {
        value: "Line",
        label: "Line",
        children: [{
          value: "bezierSpline",
          label: "bezierSpline",
        }]
      }, {
        value: "Point",
        label: "Point",
        children: [{
          value: "buffer",
          label: "buffer",
        }]
      }],
      selectedOptions: [], 
      executeLoading: false,  // true or false
      executeLoadingContent: "Execute",  // "Execute" or "Loading"
      checkedBoxChecked: "true", // checkBox 
    }
  },
  methods: {
    executeFile () { // 执行 arcpy 操作
      bus.$emit("removeMapClickEvent") // 关闭 地图 hover 以及 click 事件
      bus.$emit("showTurfBar") // 展示 工具条 turf

      // let param = {
      //   fileNames: store.state.globalValue.currentSelectedLayerName,
      //   userId: store.state.userId,
      //   operation: "intersect",
      // } 
      // api.executeFile(qs.stringify(param))
      // .then()
      // .catch()
    }, 
    handleChange (value) {
      store.state.globalValue.turfTool.toolName = "" + value[1]
      let toolName = "" + value[1]
      if (toolName === "intersect") {
        store.state.globalValue.turfTool.featureNumLimit = 2
        // console.log("store.state.globalValue.turfTool.featureNumLimit", store.state.globalValue.turfTool.featureNumLimit)
      } else if (toolName === "difference") {
        store.state.globalValue.turfTool.featureNumLimit = 2
      } else if (toolName === "bezierSpline") {
        store.state.globalValue.turfTool.featureNumLimit = 1
      } else if (toolName === "buffer") {
        store.state.globalValue.turfTool.featureNumLimit = 1
      }
      let btn = document.getElementById("tooldetail-executeBtn")
      btn.classList.remove("is-disabled")
      btn.disabled = false
    },
  },
}
</script>

<style scoped>
#main-controltable-tooldetail {
  width: 20%;
  height: 100%;
  color: rgba(129, 129, 129);  
  font-size: .12rem;
  font-weight: 700; 
  /* display: flex; */
  /* flex-flow: wrap row; */
  /* justify-content: flex-start; */
  /* align-items: flex-start; */
  box-sizing: border-box;
  border-right: .01rem solid rgb(42, 42, 42);
  /* background: blueviolet; */
}
#main-controltable-tooldetail .title {
  width: 75%;
  height: .336rem;
  line-height: .336rem;
  color: #8e8e8e;
  margin-left: 5%;
}
#main-controltable-tooldetail .container {
  display: flex;
  flex-flow: nowrap row;
  justify-content: flex-start;
  align-items: center;
  margin-left: 5%;
}
#main-controltable-tooldetail .second-title {
  width: 20%;
  line-height: .12rem;
}
#main-controltable-tooldetail .element-cascader {
  display: inline;
}
#main-controltable-tooldetail .footer {
  margin-top: .1rem;
  /* height: 15%; */
  display: flex;
  flex-flow: wrap row;
  justify-content: center;
}
#main-controltable-tooldetail .footer .element-button {
  width: 50%;
  margin-top: .1rem;
  margin-bottom: .1rem;
}
#main-controltable-tooldetail .footer .element-checkbox {
  width: 51%;
  height: 60%;
  font-size: .1rem;
  /* opacity: 0; */
}
</style>

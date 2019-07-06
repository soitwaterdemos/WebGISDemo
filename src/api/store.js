import Vue from 'vue'
import Vuex from 'vuex'
import {gdJSON} from"@/assets/publicjs/gdJSON1.js"

import Map from "ol/Map.js"
import View from "ol/View.js"
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
import {defaults as defaultControls, Control} from 'ol/control.js';
import {pointerMove} from 'ol/events/condition.js';
import Select from 'ol/interaction/Select.js';
import bus from "@/api/bus.js"

Vue.use(Vuex)

const state = {
  userId: "",
  globalValue: {
    turfTool: {
      toolName: "",
      featureNumLimit: 1,
      featureTypeLimit: "",
    },
    currentVisibleLayerIndex: 0,
    currentSelectedLayerIndex: [false, false, false], /* 通过checkbox选择的图层 */
    currentSelectedLayerName: "", // 选中的图层的名字
    featureColor: "rgba(16, 164, 226, .8)",
    tableData: [{
      name: '广东行政区划简图',
    }],
    jsonFileName: [], // 统计json文件名字, 在 download.vue 中, 当尝试下载 json 时, 跳出函数
    zipFileName: [], // 统计zip文件名字, 在 download.vue 中, 当尝试下载 json 时, 跳出函数
  },
  openlayers: {
    select: new Select({ // 悬浮查看属性
      condition: pointerMove,
    }),
    map: new Map({ // 地图容器
      controls: defaultControls({
        zoom: false,
      }),
      layers: [],
      view: new View({
        projection: "EPSG:4326", 
        center: [113.859791,22.800000], 
        zoom: 7.5,
      }),
    }),
    drawAndModifyJsonLayer: new VectorLayer({ // 绘制 图层 (可被fillcolor.vue修改)
      source: new VectorSource(),
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new Stroke({
          color: '#ffcc33',
          width: 2
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: '#ffcc33'
          })
        })
      })
    }),
    geoJsonLayer: new VectorLayer({ // 源数据图层
      source: null,
      style: null,
    }),
    iconLayer: new VectorLayer({ // 图标图层
      source: new VectorSource(),
    }),
    gdJSON: gdJSON,
    geoJsonUrl: [gdJSON], 
    defaultStyle: new Style({ // 默认地图样式
      stroke: new Stroke({
        color: 'black',
        width: 0.3,
      }),
      fill: new Fill({
        color: 'rgba(129, 129, 129, 0.9)'
      }),
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({
          color: 'rgba(129, 129, 129, 0.45)'
        })
      }),
    }),
    selectedStyle: new Style({ // 选中时地图高亮样式 (可被fillcolor.vue修改)
      stroke: new Stroke({
        color: 'rgba(16, 164, 226, .8)',
        width: 0.9,
      }),
      fill: new Fill({
        color: 'rgba(129, 129, 129, 0.45)',
      }),
      image: new CircleStyle({
        radius: 8,
        fill: new Fill({
          color: 'rgba(129, 129, 129, 0.45)',
        }),
      }),
    }),
    paintStyle: new Style({ // 涂色时候的样式 (可被fillcolor.vue修改)
      stroke: new Stroke({
        color: 'black',
        width: 0.3,
      }),
      fill: new Fill({
        color: 'rgba(16, 164, 226, 0.8)'
      })
    }),
    clickType: 0, // 规定 0是查看属性, 1是涂色, 2是放置icon
  },
}

const mutations = {
  selectedCheckedBoxOpenlayersMap (state) { // checkBox 选中 或 不选中 某一checckbox, 则触发此事件, 将文件名 入队 或 出队
    let checks = state.globalValue.currentSelectedLayerIndex
    let tableDate = state.globalValue.tableData
    let selectedLayerNameArr = ""
    for (let i = 0;i < checks.length;i++) {
      if (checks[i]) { // 该图层为选中
        selectedLayerNameArr += tableDate[i].name + "__csycsy__"
      }
    }
    state.globalValue.currentSelectedLayerName = selectedLayerNameArr
    console.log("store 120", selectedLayerNameArr)
    console.log("store 121", state.globalValue.currentSelectedLayerName)
  },
  updateGeoJsonUrl (state, geoJsonUrl) { // 上传地图
    let openlayers = state.openlayers
    if (openlayers.geoJsonUrl.length < 3) {
      state.globalValue.currentVisibleLayerIndex = openlayers.geoJsonUrl.length
      bus.$emit("refreshUserMapOptionsVisibleIndex")
      openlayers.geoJsonUrl.push(geoJsonUrl)
      bus.$emit("refreshOpenlayers") // openlayers.vue
    }
  },
  setUserId (state, id) { 
    state.userId = id
  },
  changGlobalValue (state, args) {
    let key = args['key']
    let value = args['value']

    let lightValue = getLightColor(value)
    if (key === "featureColor") {
      state.globalValue.featureColor = value
      state.openlayers.paintStyle.getFill().setColor(value) // 填充颜色(会把之前已经填充的也改变颜色) —— 应该写成下面的形式

      let iconfontArr = document.getElementsByClassName("iconfont-bar") // 鼠标悬浮图标颜色
      for (let item of iconfontArr) {
        item.onmouseover = function () {
          item.style.color = value
        }
        item.onmouseout = function () {
          item.style.color = "rgba(88, 88, 88, 1)"
        }
      }
    }
    function getLightColor (str) {
      let arr = value.split(",")
      let num = parseFloat(arr[arr.length - 1])
      arr.pop()
      arr.push(" " + num * 0.5 + ")")
      let result = arr.join()
      return result
    }
  },
}

const store = new Vuex.Store({
  state: state,
  mutations: mutations
})

export default store
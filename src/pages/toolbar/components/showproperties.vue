<template>
  <div id="show-properties" @click="changeClickType()">
    <div class="iconfont iconfont-bar">&#xe645;</div>
  </div>
</template>

<script>
import "ol/ol.css"
import Feature from "ol/Feature.js"
import Map from "ol/Map.js"
import View from "ol/View.js"
import GeoJSON from "ol/format/GeoJSON.js"
import Circle from 'ol/geom/Circle.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
import {toLonLat,transform,transformExtent} from 'ol/proj';
import {defaults as defaultControls, Control} from 'ol/control.js';
import {ZoomSlider} from 'ol/control.js';
import Point from 'ol/geom/Point';
import Image from 'ol/style/Image';
import Icon from 'ol/style/Icon';
import {click, pointerMove, altKeyOnly} from 'ol/events/condition.js';
import Select from 'ol/interaction/Select.js';

import store from "@/api/store.js" // 全局状态
import bus from "@/api/bus.js"

export default {
  name: "ShowProperties",
  props: ["propsData"],
  data () {
    return {
      map: store.state.openlayers.map, // 地图
      attrTable: null,
      attributesDiv: null,
    }
  },
  methods: {
    msg (type, message) { // '信息' 弹窗功能
      this.$message({
        type: type,
        message: message,
        duration: "1500",
      })
    },
    changeClickType () { // 查看属性 or 涂色
      this.msg("info", "当前可以点选要素并显示其属性.")  // 当点击工具时, 先提示用户本工具的作用, 
      this.propsData.clickType = 0 // 修改了 toolbar.vue 的 clickType 属性值 (toolbar.vue 会监听每次 map 的 click 事件, 根据 clickType 的不同执行对应的操作)
      bus.$emit("addSelectInteraction") // 添加 map的 点选 Select
    },
    seleceFeatureAndShowProperties (event) { // 点选查看属性
      let that = this
      let pixel = this.map.getEventPixel(event.originalEvent)
      let attrTable = that.attrTable
      attrTable.innerHTML = "" // 清空子元素
      this.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
        if (feature != undefined) { // 选中要素的情况
          that.attributesDiv.style.top = "20%" // 消失
          that.attributesDiv.style.opacity = "0"
          setTimeout(() => {
            that.attributesDiv.style.top = "15%" // 出现
            that.attributesDiv.style.opacity = "1"
          }, 100)

          that.attributes = feature.getProperties() // 填充要素属性
          for (let item in that.attributes) {
            if (item === "geometry") {
              continue
            }
            let div = document.createElement("div")
            div.className = "attrLine"
            let spanChildLeft = document.createElement("span")
            spanChildLeft.className = "attrLineLeft"
            spanChildLeft.innerHTML = "&nbsp;" + item
            let spanChildRight = document.createElement("span")
            spanChildRight.className = "attrLineRight"
            spanChildRight.innerHTML = that.attributes[item]
            div.appendChild(spanChildLeft)
            div.appendChild(spanChildRight)
            attrTable.appendChild(div)
          }
        } 
      })
      if (attrTable.innerHTML === "") { // 没有选中要素的情况
        that.attributesDiv.style.top = "20%" // 出现
        that.attributesDiv.style.opacity = "0"
      }
    },
  },
  mounted () {
    this.attributesDiv = document.getElementById("main-attributes")
    this.attrTable = document.getElementById("main-attributes-container")
    bus.$on("seleceFeatureAndShowProperties", event => this.seleceFeatureAndShowProperties(event))
  },
  components: {
  },
}
</script>

<style scoped>
#show-properties {
  width: .45rem;
  height: .45rem;
  box-sizing: border-box;
  border-top: solid .001rem #aaa;
}
.iconfont {
  text-align: center;
  font-size: .3rem;
  line-height: .45rem;
  opacity: .8;
}
</style>

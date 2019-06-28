<template>
  <div id="main-toolbar" @click="beforeChangeClickType()">
    <div id="hidden" ref="hidden" class="iconfont" style="text-align:center;">&#xe646;</div>
    <show-properties :propsData="propsData" title="选择"></show-properties>
    <paint-map :propsData="propsData" title="填充"></paint-map>
    <map-icon :propsData="propsData" title="标识"></map-icon>
    <draw-and-modify :propsData="propsData" title="涂鸦"></draw-and-modify>
    <fill-color title="填充颜色"></fill-color>
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
import ShowProperties from "./components/showproperties.vue" 
import PaintMap from "./components/paintmap.vue" 
import MapIcon from "./components/mapicon.vue" 
import DrawAndModify from "./components/drawandmodify.vue" 
import FillColor from "./components/fillcolor.vue" 
import bus from "@/api/bus.js"

export default {
  name: "Toolbar",
  data () {
    return {
      map: store.state.openlayers.map, // 地图
      propsData: { // 查看属性 or 涂色
        clickType: store.state.openlayers.clickType,
        currentFeatureIsClick: false, // 是否涂色(用于Hover时更换颜色)
      }, 

      currentFeatureOriginStyle: null,
      beforeFeature: null, // 上一个要素
      currentFeature: null, // 当前要素
      select: null, // 选择器
      selectPointerMove: new Select({ // 悬浮查看属性
        // condition: pointerMove, // 屏蔽悬浮, 改为单击
        condition: click,
        style: store.state.openlayers.selectedStyle,
      }), 
    }
  },
  methods: {
    beforeChangeClickType () {
      let attributesDiv = document.getElementById("main-attributes") // 隐藏属性表
      attributesDiv.style.opacity = 0
    },
    selectFeatureAndShowAttribute () { // Hover 高亮
      this.select = this.selectPointerMove
      this.map.addInteraction(this.select)
      let that = this
      this.select.on('select', (e) => {
        if (this.currentFeature) { // beforeFeature 记录上一个要素, 方便恢复样式
          this.beforeFeature = this.currentFeature
        }
        if (this.beforeFeature) { // 鼠标移出时, 恢复原来样式
          if (that.propsData.currentFeatureIsClick === true) { // 被涂色
            that.propsData.currentFeatureIsClick = false
          } else {
            this.beforeFeature.setStyle(this.currentFeatureOriginStyle)  
          }
        }
        try {
          this.currentFeature = e.target.getFeatures().getArray()[0]
          this.currentFeatureOriginStyle = this.currentFeature.getStyle() // 获取悬浮前被悬浮要素的颜色
          this.currentFeature.setStyle(store.state.openlayers.selectedStyle) // 更新为高亮颜色
        } catch (err) {
          this.currentFeature = null
          this.beforeFeature = null
          return
        }
      })
    },
    clickFeatureAndShowAttribute () { // 点击 高亮
      this.select = this.selectPointerMove
      let that = this
      // this.select.on('select', (e) => {
      // })
    },
    seleceFeature (event) {
      let clickType = this.propsData.clickType
      if (clickType !== 3) { // 移除 绘制 修改 捕捉 控件
        bus.$emit("removeDrawModifySnap")
      }
      if (clickType === 0) {
        bus.$emit("seleceFeatureAndShowProperties", event)
      } else {
        if (clickType === 1) {
          bus.$emit("seleceFeatureAndPaint", event)
        } else if (clickType === 2) {
          bus.$emit("seleceFeatureAndPutIcon", event)
        } else if (clickType === 3) {
          bus.$emit("drawFeatureAndModify", event)
        } 
      }
    },
    addSelectInteraction () {
      this.removeOverlays()
      // let highlightColor = this.getLightColor(store.state.openlayers.selectedStyle.getFill().getColor() + "")
      let selectedStyle = store.state.openlayers.selectedStyle
      this.select = new Select({
        condition: click,
        style: new Style({ // 选中时地图高亮样式 (可被fillcolor.vue修改)
          stroke: new Stroke({
            color: selectedStyle.getStroke().getColor(),
            width: 0.9,
          }),
          fill: new Fill({
            color: selectedStyle.getFill().getColor(),
          }),
          image: new CircleStyle({
            radius: 8,
            fill: new Fill({
              color: selectedStyle.getFill().getColor(),
            }),
          }),
        }),
      })
      this.map.addInteraction(this.select)
    },
    removeSelectInteraction () {
      this.map.removeInteraction(this.select)
    },
    removeOverlays () {
      this.select.getFeatures().clear() // 清空已选要素
    }
    // getLightColor (value) {
    //   let arr = value.split(",")
    //   let num = parseFloat(arr[arr.length - 1])
    //   arr.pop()
    //   arr.push(" " + num * 0.5 + ")")
    //   let result = arr.join()
    //   return result
    // }
  },
  mounted () {
    // this.selectFeatureAndShowAttribute() // 监听 Hover 高亮
    this.clickFeatureAndShowAttribute() // 监听 点击 高亮
    this.map.on("click", this.seleceFeature)
    bus.$on("addSelectInteraction", () => this.addSelectInteraction()) // 在tolbar.vue 的子组件中, 同时是否
    bus.$on("removeSelectInteraction", () => this.removeSelectInteraction())
    // bus.$on("removeMapClickEvent", () => { // 移除 'Hover 高亮' 以及 '点击' 监听
    //   this.map.removeEventListener("click", this.seleceFeature)
    //   this.map.removeInteraction(this.select)
    // })
    // bus.$on("addMapClickEvent", () => { // 移除 'Hover 高亮' 以及 '点击' 监听
    //   this.map.addEventListener("click", this.seleceFeature)
    //   this.map.addInteraction(this.select)
    // })
  },
  components: {
    ShowProperties,
    PaintMap,
    MapIcon,
    DrawAndModify,
    FillColor,
  },
}
</script>

<style>
#main-toolbar {
  position: fixed;
  left: 2%;
  top: 25%;
  width: .45rem;
  height: 2.4rem;
  --border-radius: .03rem; 
  border-radius: var(--border-radius); 
  background: rgb(235, 235, 235);
}
#main-toolbar #hidden {
  height: .15rem;
  border-top-left-radius: var(--border-radius); 
  border-top-right-radius: var(--border-radius); 
}
.iconfont-bar:hover {
  color: rgba(16, 164, 226, .8);
}
.el-color-picker__trigger .el-color-picker__color {
  border: none;
}
</style>

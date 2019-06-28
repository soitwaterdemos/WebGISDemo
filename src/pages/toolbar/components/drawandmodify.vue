<template>
  <div id="draw-and-modify" @mouseenter="mouseenter()" @mouseleave="mouseleave()" @click="changeClickType()">
    <div class="iconfont iconfont-bar">&#xe666;</div>
    <div id="draw-and-modify-expand" ref="expand">
      <div class="choice iconfont-bar" @click="changeDrawType('Point')" title="画点"><span :class="expandIconfontClass">&#xe608;</span></div>
      <div class="choice iconfont-bar" @click="changeDrawType('LineString')" title="画线"><span :class="expandIconfontClass">&#xec1f;</span></div>
      <div class="choice iconfont-bar" @click="changeDrawType('Polygon')" title="画多边形"><span :class="expandIconfontClass">&#xec1e;</span></div>
      <div class="choice iconfont-bar" @click="changeDrawType('Circle')" title="画圆"><span :class="expandIconfontClass">&#xe629;</span></div>
      <div class="choice iconfont-bar" @click="clearVectorSource()" title="清空绘制图层"><span :class="expandIconfontClass">&#xe633;</span></div>
    </div>
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
import {Circle as CircleStyle, Fill, Stroke, Style, Text} from 'ol/style.js';
import {toLonLat,transform,transformExtent} from 'ol/proj';
import {defaults as defaultControls, Control} from 'ol/control.js';
import {ZoomSlider} from 'ol/control.js';
import Point from 'ol/geom/Point';
import Image from 'ol/style/Image';
import Icon from 'ol/style/Icon';
import {click, pointerMove, altKeyOnly} from 'ol/events/condition.js';
import Select from 'ol/interaction/Select.js';
import MousePosition from 'ol/control/MousePosition.js';
import {createStringXY} from 'ol/coordinate.js';
import {Draw, Modify, Snap} from 'ol/interaction.js';

import store from "@/api/store.js" // 全局状态
import bus from "@/api/bus.js"

export default {
  name: "DrawAndModify",
  props: ["propsData"],
  data () {
    return {
      map: store.state.openlayers.map, // 地图
      drawAndModifyJsonLayer: store.state.openlayers.drawAndModifyJsonLayer, // 地图的图层
      draw: null, // 绘制控件
      snap: null, // 捕捉控件
      modify: null, // 修改控件
      typeSelect: "Point", // 绘制类型
      enterExpand: false, // 是否进入扩展栏
      expandIconfontClass: "iconfont expand-iconfont", // 扩展icon的类名
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
    clearVectorSource () { // 清空图层
      this.drawAndModifyJsonLayer.getSource().clear()
      this.msg("info", `绘制图层已清空.`)
      bus.$emit("removeSelectInteraction") // 移除 map的 点选 Select
    },
    mouseenter () { // 进入时'显示'
      this.enterExpand = true
      this.$refs.expand.style.width = "2.25rem"
      this.$refs.expand.style.height = ".45rem"
      this.expandIconfontClass = "iconfont"
      
    },
    mouseleave () { // 退出时'隐藏'
      this.enterExpand = false
      setTimeout(() => {
        if (this.enterExpand === false) {
          this.$refs.expand.style.width = "0px"
          this.$refs.expand.style.height = "0px"
          this.expandIconfontClass = "iconfont expand-iconfont"
        }
      }, 300)
    },
    changeDrawType (type) {
      if (type === "Point") {
        this.msg("info", "当前画笔<点>:  点击鼠标'左键'即可绘制点要素")
      } else if (type === "LineString") {
        this.msg("info", "当前画笔<折线>:  点击鼠标'右键'即可绘制线要素, 双击'右键'完成绘制, 若单击'左键'取消绘制.")
      } else if (type === "Polygon") {
        this.msg("info", "当前画笔<多边形>:  点击鼠标'右键'即可绘制面要素, 双击'右键'完成绘制, 若单击'左键'取消绘制.")
      } else if (type === "Circle") {
        this.msg("info", "当前画笔<圆>:  点击鼠标'右键'确定圆心, 再次单击'右键'完成绘制.")
      }
      this.typeSelect = type
      this.map.removeInteraction(this.draw)
      this.map.removeInteraction(this.snap)
      this.addInteractions()
    },
    changeClickType () { 
      this.propsData.clickType = 3
    },
    removeDrawModifySnap () { // 移除 绘制 修改 捕捉 控件
      this.map.removeInteraction(this.modify)
      this.map.removeInteraction(this.draw)
      this.map.removeInteraction(this.snap)
    },
    drawFeatureAndModify (event) { // 绘制, 捕捉, 修改
      this.removeDrawModifySnap()
      this.modify = new Modify({ // 添加控件 Modify
        source: this.drawAndModifyJsonLayer.getSource(),
      })
      this.map.addInteraction(this.modify)
      this.addInteractions()      
    },
    addInteractions () { // 添加 draw 以及 snap 控件
      let source = this.drawAndModifyJsonLayer.getSource()
      this.snap = new Snap({ // 添加控件 snap
        source: source, 
      })
      this.map.addInteraction(this.snap)

      this.draw = new Draw({
        source: source,
        type: this.typeSelect
      });
      this.map.addInteraction(this.draw);
    },
  },
  mounted () {
    bus.$on("removeDrawModifySnap", () => this.removeDrawModifySnap())
    bus.$on("drawFeatureAndModify", event => this.drawFeatureAndModify(event))
  },
  components: {
  },
}
</script>

<style scoped>
#draw-and-modify {
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
#draw-and-modify #draw-and-modify-expand {
  position: relative;
  left: .5rem;
  top: -.45rem;
  width: 0rem;
  height: 0rem;
  transition: width .2s ease;
  display: flex;
  flex-flow: nowrap row;
  border-radius: .03rem; 
  background: rgb(235, 235, 235);
}
#draw-and-modify #draw-and-modify-expand .choice {
  height: 100%;
  width: .45rem;
  box-sizing: border-box;
  border-right: solid .001rem #aaa;
  display: flex;
  justify-content: center;
}
#draw-and-modify #draw-and-modify-expand .expand-iconfont {
  font-size: 0rem;
  line-height: 0rem;
}
</style>

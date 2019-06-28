<template>
  <div id="paint-map" @click="changeClickType()">
    <div class="iconfont iconfont-bar">&#xe649;</div>
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
  name: "PaintMap",
  props: ["propsData"],
  data () {
    return {
      map: store.state.openlayers.map, // 地图
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
    changeClickType () { 
      this.msg("info", `'左键'点选要素涂色.`)
      this.propsData.clickType = 1
      bus.$emit("removeSelectInteraction") // 移除 map的 点选 Select
    },
    seleceFeatureAndPaint (event) {
      let that = this
      let pixel = this.map.getEventPixel(event.originalEvent)
      this.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
        if (feature !== undefined) { // 选中要素的情况
          that.propsData.currentFeatureIsClick = true

          // console.log("--**", store.state.openlayers.paintStyle.getFill().getColor())
          let tempStyle = new Style({
            stroke: new Stroke({
              color: 'black',
              width: 0.3,
            }),
            fill: new Fill({
              color: store.state.openlayers.paintStyle.getFill().getColor(),
            })
          })
          feature.setStyle(tempStyle)
        } 
      })
    },
  },
  mounted () {
    bus.$on("seleceFeatureAndPaint", event => this.seleceFeatureAndPaint(event))
  },
  components: {
  },
}
</script>

<style scoped>
#paint-map {
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

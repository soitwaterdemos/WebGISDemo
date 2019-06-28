<template>
  <div id="map-icon" @click="changeClickType()">
    <div class="iconfont iconfont-bar">&#xe625;</div>
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

import store from "@/api/store.js" // 全局状态
import bus from "@/api/bus.js"
import iconUrl from "@/assets/png/mapIcon.png"

export default {
  name: "MapIcon",
  props: ["propsData"],
  data () {
    return {
      map: store.state.openlayers.map, // 地图
      iconLayer: store.state.openlayers.iconLayer, // 地图的图层
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
      this.msg("info", `'左键'点选添加图标.`)
      this.propsData.clickType = 2
      bus.$emit("removeSelectInteraction") // 移除 map的 点选 Select
    },
    seleceFeatureAndPutIcon (event) { // 放置 icon

      let iconFeature = new Feature({
        geometry: new Point(event.coordinate),
      })

      let iconStyle = new Style({
        // text: new Text({ // 字体, 未成功, 浪费许多时间
        //   font: 'Normal ' + 12 + 'px ' + 'iconfont',
        //   text: "\e645",
        //   fill: new Fill({ color: "green" }),
        // }),

        image: new Icon ({ // 图片样式
          src: iconUrl,
          opacity: 0.7,
        }),

        // new CircleStyle({ // 普通样式
        //   radius: 6,  
		    //   fill: new Fill({
        //     color: 'rgba(200, 155, 155, 0.8)'
        //   }),  
		    //   stroke: new Stroke({
        //     color: 'black',
        //     width: 0.3,
        //   })  
        // }),
      })

      iconFeature.setStyle(iconStyle);
      this.iconLayer.getSource().addFeature(iconFeature)
    },
  },
  mounted () {
    bus.$on("seleceFeatureAndPutIcon", event => this.seleceFeatureAndPutIcon(event))
  },
  components: {
  },
}
</script>

<style scoped>
#map-icon {
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

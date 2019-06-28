<template>
  <div id="main-openlayers">
    <div id="map"></div>
    <zoom :map="map"></zoom>
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

import store from "@/api/store.js" // 全局状态
import Zoom from "./components/zoom.vue"
import bus from "@/api/bus.js"

export default {
  name: "Openlayers",
  data () {
    return {
      map: store.state.openlayers.map, // 地图
      originGeoJSON: null, 
      vectorSource: null, // json数据对象
      extent: null, // 四至, 用于 方法fitBround() 中适应范围
      geoJsonLayer: store.state.openlayers.geoJsonLayer, // 地图的图层
      iconLayer: store.state.openlayers.iconLayer, // 地图的图层
      drawAndModifyJsonLayer: store.state.openlayers.drawAndModifyJsonLayer, // 地图的图层
      // geoJsonUrl: store.state.openlayers.geoJsonUrl, // geojson的静态资源地址
    }
  },
  methods: {
    setVectorSource () { // 
      // this.vectorSource = null
      this.originGeoJSON = store.state.openlayers.geoJsonUrl[store.state.globalValue.currentVisibleLayerIndex]
      this.vectorSource = new VectorSource({
        features: (new GeoJSON()).readFeatures(this.originGeoJSON),
        // format: new GeoJSON(),
        // url: this.geoJsonUrl, 
      })
    },
    setGeoJsonLayer () {
      this.geoJsonLayer = null
      let that = this
      this.geoJsonLayer = new VectorLayer({
        source: this.vectorSource,
        style: store.state.openlayers.defaultStyle,
      })
    },
  },
  mounted () {
    this.setVectorSource()
    this.setGeoJsonLayer()
    this.map.addLayer(this.geoJsonLayer) // 源数据层
    this.map.addLayer(this.iconLayer) // icon层
    this.map.addLayer(this.drawAndModifyJsonLayer) // 绘制层
    this.map.setTarget("map")
    bus.$on("refreshOpenlayers", () => {
      this.map.removeLayer(this.geoJsonLayer) // 源数据层
      this.setVectorSource()
      this.setGeoJsonLayer()
      this.map.addLayer(this.geoJsonLayer) // 源数据层
      this.map.getView().fit(this.vectorSource.getExtent(), this.map.getSize())
    })
    bus.$on("cleanAllLayers", () => {
      this.map.removeLayer(this.geoJsonLayer) // 源数据层
    })
    bus.$on("showAllLayers", () => {
      this.map.addLayer(this.geoJsonLayer) // 展示地图源数据层
    })
  },
  components: {
    Zoom,
  },
}
</script>

<style>
#main-openlayers #map{
  width: 100%;
  height: 100%;
  position: relative;
  left: 0;
  right: 0;
}
</style>

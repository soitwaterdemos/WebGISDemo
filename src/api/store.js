import Vue from 'vue'
import Vuex from 'vuex'
import {gdJSON} from"@/assets/publicjs/gdJSON1.js"
import Element from 'element-ui'

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
import { log } from 'core-js';

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
    // gdJSON: "http://localhost:8081/static/init.json",
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
  baidu: {
    map: {},
    poi: {},
    styleJson:[{
      "featureType": "land",
      "elementType": "geometry",
      "stylers": {
          "color": "#242f3eff"
      }
  }, {
      "featureType": "manmade",
      "elementType": "geometry",
      "stylers": {
          "color": "#242f3eff"
      }
  }, {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": {
          "color": "#17263cff"
      }
  }, {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": {
          "color": "#9e7d60ff"
      }
  }, {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": {
          "color": "#554631ff"
      }
  }, {
      "featureType": "districtlabel",
      "elementType": "labels.text.fill",
      "stylers": {
          "color": "#d69563ff"
      }
  }, {
      "featureType": "districtlabel",
      "elementType": "labels.text.stroke",
      "stylers": {
          "color": "#17263cff",
          "weight": 3
      }
  }, {
      "featureType": "poilabel",
      "elementType": "labels.text.fill",
      "stylers": {
          "color": "#d69563ff"
      }
  }, {
      "featureType": "poilabel",
      "elementType": "labels.text.stroke",
      "stylers": {
          "color": "#17263cff",
          "weight": 3
      }
  }, {
      "featureType": "subway",
      "elementType": "geometry",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "railway",
      "elementType": "geometry",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "poilabel",
      "elementType": "labels.icon",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "subwaylabel",
      "elementType": "labels",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "subwaylabel",
      "elementType": "labels.icon",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "tertiarywaysign",
      "elementType": "labels",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "tertiarywaysign",
      "elementType": "labels.icon",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "provincialwaysign",
      "elementType": "labels.icon",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "provincialwaysign",
      "elementType": "labels",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "nationalwaysign",
      "elementType": "labels.icon",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "nationalwaysign",
      "elementType": "labels",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "highwaysign",
      "elementType": "labels.icon",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "highwaysign",
      "elementType": "labels",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "green",
      "elementType": "geometry",
      "stylers": {
          "color": "#263b3eff"
      }
  }, {
      "featureType": "nationalwaysign",
      "elementType": "labels.text.fill",
      "stylers": {
          "color": "#d0021bff"
      }
  }, {
      "featureType": "nationalwaysign",
      "elementType": "labels.text.stroke",
      "stylers": {
          "color": "#ffffffff"
      }
  }, {
      "featureType": "city",
      "elementType": "labels",
      "stylers": {
          "visibility": "on"
      }
  }, {
      "featureType": "city",
      "elementType": "labels.icon",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "city",
      "elementType": "labels.text.fill",
      "stylers": {
          "color": "#d69563ff"
      }
  }, {
      "featureType": "city",
      "elementType": "labels.text.stroke",
      "stylers": {
          "color": "#17263cff"
      }
  }, {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": {
          "color": "#d69563ff"
      }
  }, {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": {
          "color": "#242f3eff"
      }
  }, {
      "featureType": "local",
      "elementType": "geometry.fill",
      "stylers": {
          "color": "#38414eff"
      }
  }, {
      "featureType": "local",
      "elementType": "geometry.stroke",
      "stylers": {
          "color": "#ffffff0"
      }
  }, {
      "featureType": "fourlevelway",
      "elementType": "geometry.fill",
      "stylers": {
          "color": "#38414eff"
      }
  }, {
      "featureType": "fourlevelway",
      "elementType": "geometry.stroke",
      "stylers": {
          "color": "#ffffff00"
      }
  }, {
      "featureType": "tertiaryway",
      "elementType": "geometry.fill",
      "stylers": {
          "color": "#38414eff"
      }
  }, {
      "featureType": "tertiaryway",
      "elementType": "geometry.stroke",
      "stylers": {
          "color": "#ffffff0"
      }
  }, {
      "featureType": "tertiaryway",
      "elementType": "labels.text.fill",
      "stylers": {
          "color": "#759879ff"
      }
  }, {
      "featureType": "fourlevelway",
      "elementType": "labels.text.fill",
      "stylers": {
          "color": "#759879ff"
      }
  }, {
      "featureType": "highway",
      "elementType": "labels.text.fill",
      "stylers": {
          "color": "#759879ff"
      }
  }, {
      "featureType": "highway",
      "elementType": "geometry.fill",
      "stylers": {
          "color": "#9e7d60ff"
      }
  }, {
      "featureType": "highway",
      "elementType": "geometry.stroke",
      "stylers": {
          "color": "#554631ff"
      }
  }, {
      "featureType": "provincialway",
      "elementType": "geometry.fill",
      "stylers": {
          "color": "#9e7d60ff"
      }
  }, {
      "featureType": "provincialway",
      "elementType": "geometry.stroke",
      "stylers": {
          "color": "#554631ff"
      }
  }, {
      "featureType": "tertiaryway",
      "elementType": "labels.text.stroke",
      "stylers": {
          "color": "#1a2e1cff"
      }
  }, {
      "featureType": "fourlevelway",
      "elementType": "labels.text.stroke",
      "stylers": {
          "color": "#1a2e1cff"
      }
  }, {
      "featureType": "highway",
      "elementType": "labels.text.stroke",
      "stylers": {
          "color": "#1a2e1cff"
      }
  }, {
      "featureType": "nationalway",
      "elementType": "labels.text.stroke",
      "stylers": {
          "color": "#1a2e1cff"
      }
  }, {
      "featureType": "nationalway",
      "elementType": "labels.text.fill",
      "stylers": {
          "color": "#759879ff"
      }
  }, {
      "featureType": "nationalway",
      "elementType": "geometry.fill",
      "stylers": {
          "color": "#9e7d60ff"
      }
  }, {
      "featureType": "nationalway",
      "elementType": "geometry.stroke",
      "stylers": {
          "color": "#554631ff"
      }
  }, {
      "featureType": "cityhighway",
      "elementType": "geometry.fill",
      "stylers": {
          "color": "#9e7d60ff"
      }
  }, {
      "featureType": "cityhighway",
      "elementType": "geometry.stroke",
      "stylers": {
          "color": "#554631ff"
      }
  }, {
      "featureType": "arterial",
      "elementType": "geometry.fill",
      "stylers": {
          "color": "#9e7d60ff"
      }
  }, {
      "featureType": "arterial",
      "elementType": "geometry.stroke",
      "stylers": {
          "color": "#554631fa"
      }
  }, {
      "featureType": "medicallabel",
      "elementType": "labels",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "medicallabel",
      "elementType": "labels.icon",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "entertainmentlabel",
      "elementType": "labels",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "entertainmentlabel",
      "elementType": "labels.icon",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "estatelabel",
      "elementType": "labels",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "estatelabel",
      "elementType": "labels.icon",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "businesstowerlabel",
      "elementType": "labels",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "businesstowerlabel",
      "elementType": "labels.icon",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "companylabel",
      "elementType": "labels",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "companylabel",
      "elementType": "labels.icon",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "governmentlabel",
      "elementType": "labels",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "governmentlabel",
      "elementType": "labels.icon",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "restaurantlabel",
      "elementType": "labels",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "restaurantlabel",
      "elementType": "labels.icon",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "hotellabel",
      "elementType": "labels",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "hotellabel",
      "elementType": "labels.icon",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "shoppinglabel",
      "elementType": "labels",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "shoppinglabel",
      "elementType": "labels.icon",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "lifeservicelabel",
      "elementType": "labels",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "lifeservicelabel",
      "elementType": "labels.icon",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "carservicelabel",
      "elementType": "labels",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "carservicelabel",
      "elementType": "labels.icon",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "financelabel",
      "elementType": "labels",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "financelabel",
      "elementType": "labels.icon",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "otherlabel",
      "elementType": "labels",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "otherlabel",
      "elementType": "labels.icon",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "airportlabel",
      "elementType": "labels",
      "stylers": {
          "visibility": "on"
      }
  }, {
      "featureType": "airportlabel",
      "elementType": "labels.text.fill",
      "stylers": {
          "color": "#d69563ff"
      }
  }, {
      "featureType": "airportlabel",
      "elementType": "labels.text.stroke",
      "stylers": {
          "color": "#17263cff"
      }
  }, {
      "featureType": "airportlabel",
      "elementType": "labels.icon",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "highway",
      "stylers": {
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "6"
      }
  }, {
      "featureType": "highway",
      "stylers": {
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "7"
      }
  }, {
      "featureType": "highway",
      "stylers": {
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "8"
      }
  }, {
      "featureType": "highway",
      "stylers": {
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "9"
      }
  }, {
      "featureType": "highway",
      "stylers": {
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "10"
      }
  }, {
      "featureType": "highway",
      "elementType": "geometry",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "6"
      }
  }, {
      "featureType": "highway",
      "elementType": "geometry",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "7"
      }
  }, {
      "featureType": "highway",
      "elementType": "geometry",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "8"
      }
  }, {
      "featureType": "highway",
      "elementType": "geometry",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "9"
      }
  }, {
      "featureType": "highway",
      "elementType": "geometry",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "10"
      }
  }, {
      "featureType": "nationalway",
      "stylers": {
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "6"
      }
  }, {
      "featureType": "nationalway",
      "stylers": {
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "7"
      }
  }, {
      "featureType": "nationalway",
      "stylers": {
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "8"
      }
  }, {
      "featureType": "nationalway",
      "stylers": {
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "9"
      }
  }, {
      "featureType": "nationalway",
      "stylers": {
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "10"
      }
  }, {
      "featureType": "nationalway",
      "elementType": "geometry",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "6"
      }
  }, {
      "featureType": "nationalway",
      "elementType": "geometry",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "7"
      }
  }, {
      "featureType": "nationalway",
      "elementType": "geometry",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "8"
      }
  }, {
      "featureType": "nationalway",
      "elementType": "geometry",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "9"
      }
  }, {
      "featureType": "nationalway",
      "elementType": "geometry",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "10"
      }
  }, {
      "featureType": "nationalway",
      "elementType": "labels",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "6"
      }
  }, {
      "featureType": "nationalway",
      "elementType": "labels",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "7"
      }
  }, {
      "featureType": "nationalway",
      "elementType": "labels",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "8"
      }
  }, {
      "featureType": "nationalway",
      "elementType": "labels",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "9"
      }
  }, {
      "featureType": "nationalway",
      "elementType": "labels",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "10"
      }
  }, {
      "featureType": "highway",
      "elementType": "labels",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "6"
      }
  }, {
      "featureType": "highway",
      "elementType": "labels",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "7"
      }
  }, {
      "featureType": "highway",
      "elementType": "labels",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "8"
      }
  }, {
      "featureType": "highway",
      "elementType": "labels",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "9"
      }
  }, {
      "featureType": "highway",
      "elementType": "labels",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "10"
      }
  }, {
      "featureType": "provincialway",
      "stylers": {
          "curZoomRegionId": "0",
          "curZoomRegion": "8,9",
          "level": "8"
      }
  }, {
      "featureType": "provincialway",
      "stylers": {
          "curZoomRegionId": "0",
          "curZoomRegion": "8,9",
          "level": "9"
      }
  }, {
      "featureType": "provincialway",
      "elementType": "geometry",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "8,9",
          "level": "8"
      }
  }, {
      "featureType": "provincialway",
      "elementType": "geometry",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "8,9",
          "level": "9"
      }
  }, {
      "featureType": "provincialway",
      "elementType": "labels",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "8,9",
          "level": "8"
      }
  }, {
      "featureType": "provincialway",
      "elementType": "labels",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "8,9",
          "level": "9"
      }
  }, {
      "featureType": "cityhighway",
      "stylers": {
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "6"
      }
  }, {
      "featureType": "cityhighway",
      "stylers": {
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "7"
      }
  }, {
      "featureType": "cityhighway",
      "stylers": {
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "8"
      }
  }, {
      "featureType": "cityhighway",
      "stylers": {
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "9"
      }
  }, {
      "featureType": "cityhighway",
      "stylers": {
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "10"
      }
  }, {
      "featureType": "cityhighway",
      "elementType": "geometry",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "6"
      }
  }, {
      "featureType": "cityhighway",
      "elementType": "geometry",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "7"
      }
  }, {
      "featureType": "cityhighway",
      "elementType": "geometry",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "8"
      }
  }, {
      "featureType": "cityhighway",
      "elementType": "geometry",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "9"
      }
  }, {
      "featureType": "cityhighway",
      "elementType": "geometry",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "10"
      }
  }, {
      "featureType": "cityhighway",
      "elementType": "labels",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "6"
      }
  }, {
      "featureType": "cityhighway",
      "elementType": "labels",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "7"
      }
  }, {
      "featureType": "cityhighway",
      "elementType": "labels",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "8"
      }
  }, {
      "featureType": "cityhighway",
      "elementType": "labels",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "9"
      }
  }, {
      "featureType": "cityhighway",
      "elementType": "labels",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "6,10",
          "level": "10"
      }
  }, {
      "featureType": "arterial",
      "stylers": {
          "curZoomRegionId": "0",
          "curZoomRegion": "9,10",
          "level": "9"
      }
  }, {
      "featureType": "arterial",
      "stylers": {
          "curZoomRegionId": "0",
          "curZoomRegion": "9,10",
          "level": "10"
      }
  }, {
      "featureType": "arterial",
      "elementType": "geometry",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "9,10",
          "level": "9"
      }
  }, {
      "featureType": "arterial",
      "elementType": "geometry",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "9,10",
          "level": "10"
      }
  }, {
      "featureType": "arterial",
      "elementType": "labels",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "9,10",
          "level": "9"
      }
  }, {
      "featureType": "arterial",
      "elementType": "labels",
      "stylers": {
          "visibility": "off",
          "curZoomRegionId": "0",
          "curZoomRegion": "9,10",
          "level": "10"
      }
  }, {
      "featureType": "building",
      "elementType": "geometry.fill",
      "stylers": {
          "color": "#2a3341ff"
      }
  }, {
      "featureType": "building",
      "elementType": "geometry.stroke",
      "stylers": {
          "color": "#1a212eff"
      }
  }, {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": {
          "color": "#759879ff"
      }
  }, {
      "featureType": "road",
      "elementType": "labels.text.stroke",
      "stylers": {
          "color": "#1a2e1cff"
      }
  }, {
      "featureType": "provincialway",
      "elementType": "labels.text.fill",
      "stylers": {
          "color": "#759879ff"
      }
  }, {
      "featureType": "cityhighway",
      "elementType": "labels.text.fill",
      "stylers": {
          "color": "#759879ff"
      }
  }, {
      "featureType": "arterial",
      "elementType": "labels.text.fill",
      "stylers": {
          "color": "#759879ff"
      }
  }, {
      "featureType": "provincialway",
      "elementType": "labels.text.stroke",
      "stylers": {
          "color": "#1a2e1cff"
      }
  }, {
      "featureType": "cityhighway",
      "elementType": "labels.text.stroke",
      "stylers": {
          "color": "#1a2e1cff"
      }
  }, {
      "featureType": "arterial",
      "elementType": "labels.text.stroke",
      "stylers": {
          "color": "#1a2e1cff"
      }
  }, {
      "featureType": "local",
      "elementType": "labels",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "manmade",
      "elementType": "labels.text.fill",
      "stylers": {
          "color": "#d69563ff"
      }
  }, {
      "featureType": "manmade",
      "elementType": "labels.text.stroke",
      "stylers": {
          "color": "#17263cff"
      }
  }, {
      "featureType": "subwaystation",
      "elementType": "geometry",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "transportationlabel",
      "elementType": "labels.icon",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "transportationlabel",
      "elementType": "labels",
      "stylers": {
          "visibility": "off"
      }
  }, {
      "featureType": "estate",
      "elementType": "geometry",
      "stylers": {
          "color": "#2a3341ff"
      }
  }],
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
      // state.globalValue.tableData
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
      // let layers = state.openlayers.map.getLayers().getArray()

      // state.openlayers.selectedStyle.getFill().setColor(lightValue) // 悬浮颜色
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
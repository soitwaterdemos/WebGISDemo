<template>
  <div id="openlayers-zoom">

    <div id="zoom-in" class="iconfont zoom" title="放大视图" @click="zoomIn()">&#xe605;</div>
    <!-- <div id="zoom-slider">
      <svg width="30" height="120">
        <g id="pathSet">
          <line x1="6" y1="10" x2="24" y2="10" style="stroke:rgb(180, 180, 180, 0.8);stroke-width:1" />
          <line x1="6" y1="20" x2="24" y2="20" style="stroke:rgb(180, 180, 180, 0.8);stroke-width:1" />
          <line x1="6" y1="30" x2="24" y2="30" style="stroke:rgb(180, 180, 180, 0.8);stroke-width:1" />
          <line x1="6" y1="40" x2="24" y2="40" style="stroke:rgb(180, 180, 180, 0.8);stroke-width:1" />
          <line x1="6" y1="50" x2="24" y2="50" style="stroke:rgb(180, 180, 180, 0.8);stroke-width:1" />
          <line x1="6" y1="60" x2="24" y2="60" style="stroke:rgb(180, 180, 180, 0.8);stroke-width:1" />
          <line x1="6" y1="70" x2="24" y2="70" style="stroke:rgb(180, 180, 180, 0.8);stroke-width:1" />
        </g>
        <user href="#pathSet"></user>
      </svg>
    </div> -->
    <div id="zoom-out" class="iconfont zoom" title="缩小视图" @click="zoomOut()">&#xe604;</div>
    <div id="zoom-all" class="iconfont zoom" title="缩放至全图" @click="zoomAll()">&#xe606;</div>
  </div>
</template>

<script>
import bus from "@/api/bus.js"

export default {
  name: "Zoom",
  props: ["map"],
  data () {
    return {
      zoomIndex: 0,
    }  
  },
  methods: {
    zoomAll () { // 缩放至
      bus.$emit("refreshOpenlayers")
    },
    zoomIn () { // 放大图像
      let view = this.map.getView()
      view.animate({
        zoom: view.getZoom() + 0.5,
      })
    },
    zoomOut () { // 缩小图像
      let view = this.map.getView()
      let zoom = view.getZoom()
      if (zoom - 0.5 > 2.5) {
        view.animate({
          zoom: zoom - 0.5,
        })
      }
    },
  },
}
</script>

<style scoped>
#openlayers-zoom {
  width: .3rem;
  height: 1.4rem;
  position: relative;
  left: 2%;
  bottom: 1.6rem;
}
#openlayers-zoom .zoom {
  width: .3rem;
  height: .3rem;
  margin-top: .15rem;
  text-align: center;
  font-size: .3rem;
  line-height: .3rem;
  color: #fff;
  border-radius: 50%;
}
#openlayers-zoom #zoom-all {
  box-sizing: border-box;
  border: .01rem solid #fff;
  font-size: .28rem;
  border-radius: .04rem;
}
#openlayers-zoom #zoom-slider {
  height: .8rem;
  width: .3rem;
}
</style>

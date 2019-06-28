<template>
  <div id="fill-color">
    <el-color-picker
      id="element-fill-color" popper-class="el-color-dropdownpanel" size="medium"
      v-model="fillColor"  show-alpha :predefine="predefineColors" @change="changGlobalValueFeatureColor">
    </el-color-picker>
  </div>
</template>

<script>
import store from "@/api/store.js" // 全局状态
// import bus from "@/api/bus.js"
// import iconUrl from "@/assets/png/mapIcon.png"

export default {
  name: "FillColor",
  data () {
    return {
      // map: store.state.openlayers.map, // 地图
      fillColor: 'rgba(16, 164, 226, .8)',
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'
      ]
    }
  },
  methods: {
    changGlobalValueFeatureColor () { // 改变全局要素的颜色
      let params = {
        "key": "featureColor",
        "value": this.fillColor,
      }
      store.commit("changGlobalValue", params)
    },
    openColorChoice () {
      // this.refs.elementFillColor.click()
      document.getElementsByClassName("el-color-picker__trigger")[0].click()
    },
  },
  mounted () {
    // bus.$on("seleceFeatureAndPutIcon", event => this.seleceFeatureAndPutIcon(event))
  },
}
</script>

<style scoped>
#fill-color {
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
#fill-color #element-fill-color {
  width: .45rem;
  height: .45rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>

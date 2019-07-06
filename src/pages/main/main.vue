<template>
  <div id="main">
    <openlayers id="main-openlayers" v-if="refreshOpenlayers"></openlayers>
    <letter id="main-letter"></letter>
    <toolbar v-drag></toolbar>
    <control-table id="main-controltable" v-drag></control-table>
    <attributes v-drag></attributes>
  </div>
</template>

<script>
import api from "@/api/api.js"
import qs from "qs"
import store from "@/api/store.js"
import bus from "@/api/bus.js"

import Openlayers from "@/pages/openlayers/openlayers.vue"
import Letter from "@/pages/letter/letter.vue"
import Toolbar from "@/pages/toolbar/toolbar.vue"
import ControlTable from "@/pages/controltable/controltable.vue"
import Attributes from "@/pages/attributes/attributes.vue"

export default {
  name: "Main",
  data () {
    return {
      refreshOpenlayers: true,
    }
  },
  components: {
    Openlayers,
    Letter,
    Toolbar,
    ControlTable,
    Attributes,
  },
  directives: {
    drag (el) {
      el.onmousedown = function (e) {
        let disx = e.pageX - el.offsetLeft
        let disy = e.pageY - el.offsetTop
        document.onmousemove = function (e) {
          el.style.left = e.pageX - disx + 'px'
          el.style.top = e.pageY - disy + 'px'
        }
        document.onmouseup = function (e) {
          document.onmouseup = document.onmousemove = null
        }
        e.preventDefault()
      }
    }
  },
  mounted () {
    let userId = localStorage.getItem("csyOpenlayersDemo")
    if (userId) {
      store.commit("setUserId", userId)
    } else {
      let userId = Number(new Date) + ""
      api.createUserCount(qs.stringify({"userId": userId}))
      .then(req => {
        if (req.data === "success") {
          localStorage.setItem("csyOpenlayersDemo", userId)
          store.commit("setUserId", userId)
        }
      })
    }
  },
}
</script>

<style scoped>
#main {
  width: 100%;
  height: 100%;
  z-index: 6;
  --background: rgb(80, 80, 80);
}
#main-openlayers {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: var(--background);
}
#main-letter {
  position: absolute;
  left:2%;
  top: 2%;
  z-index: 7;
}
</style>

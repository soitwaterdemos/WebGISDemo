import Vue from 'vue'
import App from './App.vue'
import router from '@/router/index.js'
// import Element from 'element-ui'
import {Tooltip, Button,  Cascader, Checkbox, ColorPicker, Table, TableColumn} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/iconfont/iconfont.css'
import "@/assets/styles/reset.css"
import "@/assets/styles/border.css"

Vue.config.productionTip = false
// Vue.use(Element)
Vue.use(Tooltip)
Vue.use(Button)
Vue.use(Cascader)
Vue.use(Checkbox)
Vue.use(ColorPicker)
Vue.use(Table)
Vue.use(TableColumn)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

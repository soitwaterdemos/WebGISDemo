import Vue from 'vue'
import Router from 'vue-router'

import Main from '@/pages/main/main.vue'

Vue.use(Router)

export default new Router({
  routes: [
    { // 当你访问'/'路径，它访问component Helloworld
      path: '/',
      name: 'Main',
      component: Main,
    }, 
  ]
})

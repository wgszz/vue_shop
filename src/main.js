import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//导入字体图标
import './assets/fonts/iconfont.css'
//导入全局样式表
import './styles/index.css'

import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
//将axios包挂载到vue的原型对象上
Vue.prototype.$http = axios

Vue.use(ElementUI)

const qs = require('qs');
Vue.prototype.qs = qs

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
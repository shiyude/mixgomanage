// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import store from '@/store/index'
import router from './router'
import i18n from './i18n'
import 'babel-polyfill'
import '@/styles/index.less'
import 'element-ui/lib/theme-chalk/index.css'
import '@/api/index'
import '@/util/axios'
import '@/util/utils'
import '@/util/goodsManageCommon'

Vue.config.productionTip = false

/* eslint-disable no-new */
// Vue.use(ElementUI);
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})

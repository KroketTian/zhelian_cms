import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
import router from './router/router';
import ElementUI from 'element-ui';
import '../theme/index.css'
// import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueDND from 'awe-dnd'

import * as filters from './config/filters.js'

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.use(VueAxios,axios);
Vue.use(VueDND)

router.beforeEach((to,from,next) => {
  if(to.meta.title){
    document.title = to.meta.title
  }
  next();
})

Vue.config.productionTip = false

//runtime（运行时）模式
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

//compiler模式
// new Vue({
//   el:'#app',
//   router,
//   components: {App},
//   template:'<App/>'
// })
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VeeValidate from 'vee-validate';
import LoadingCircle from './components/Loading/LoadingCircle'
import JwPagination from 'jw-vue-pagination';

import axios from 'axios'


Vue.use(VeeValidate);

Vue.component('jw-pagination', JwPagination);
Vue.component('LoadingCircle', LoadingCircle)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  created() {
    const userExist = localStorage.getItem('user')
    if (userExist) {
      const userData = JSON.parse(userExist)
      this.$store.commit('SET_USER_DATA', userData)
    }
    axios.interceptors.response.use(
      response => response,
      error => {
        if(error.response.status === 422 || error.response.status === 401) {
          this.$store.dispatch('logout')
        }
        return Promise.reject(error)
      }
    )
  },
  render: h => h(App)
}).$mount('#app')

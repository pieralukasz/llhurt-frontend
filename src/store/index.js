import Vue from 'vue'
import Vuex from 'vuex'
import Auth from './modules/auth'
import Flash from './modules/flash'
import Product from './modules/product'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      // hostName: 'https://llhurt.herokuapp.com/api/'

      // hostName: 'http://e-szlafrok.xaa.pl/api/'

      hostName: 'http://localhost:8082/api/'
  },
  modules: {
    Auth,
    Flash,
    Product,
  }
})

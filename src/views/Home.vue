<template lang="pug">
  .home
    Navbar
    router-view 
</template>

<script>

import Navbar from '@/components/Home/Navbar'
import LogOut from '@/components/Auth/LogOut'
import { authComputed } from '../store/modules/helpers'

export default {
  name: 'Home',
  data() {
    return {
      Products: null,
    }
  },
  computed: {
    ...authComputed
  },

  components: {
    LogOut,
    Navbar,

  },
  created() {
      
      this.$store.dispatch('token')

      if(!sessionStorage.getItem("is_reloaded")){

        this.$store.commit('FLASH_MESSAGE','Pomyslnie zalgoowano')
        setTimeout(() => {

        this.$store.commit('CLEAR_FLASH_MESSAGE')

        sessionStorage.setItem("is_reloaded", true);

        }, 3000)
      }
  },
}

</script>

<style lang="scss">

@import './style/breakpoints.scss';

.home {
  width: 100%;
}
  
</style>
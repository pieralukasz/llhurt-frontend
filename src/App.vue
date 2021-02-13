<template lang="pug">
  #app
    router-view
</template>

<script>

export default {
  name: 'App',
}
</script>

<style lang="scss">

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  min-width: 100%;
}

</style>

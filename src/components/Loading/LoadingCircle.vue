<template>
    <div class="loadingCircle">
        <div class="preloader-wrapper active loading-circle">
            <div class="spinner-layer spinner-blue-only">
                <div class="circle-clipper left">
                    <div class="circle"></div>
                </div>
                <div class="gap-patch">
                    <div class="circle"></div>
                </div>
                <div class="circle-clipper right">
            <div class="circle"></div>
        </div>
    </div>
  </div>
        
    </div>
</template>

<script>
export default {
    name: 'LoadingCircle',
}
</script>

<style lang="scss">

.loading-circle {
    margin-top: 3px;
    height: 30px;
    width: 30px;
}
</style>

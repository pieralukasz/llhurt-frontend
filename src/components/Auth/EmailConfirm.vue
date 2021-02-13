<template lang="pug">
    h4.center.confirming-email.blue-text Email jest potwierdzany...
</template>

<script>

export default {
    name: 'Reminder',
    data(){
        return{

        }
    },
    mounted() {
        this.$store.dispatch('emailConfirm', { token: this.$route.params.token })
        .then(() => {
            this.$router.push({name: 'Login'})
            this.$store.commit('Twoj mail zostal zaakceptowany!!')
        })
    },

}
</script>

<style lang="scss" >

.confirming-email{
    padding-top: 50px;
}
    
</style>
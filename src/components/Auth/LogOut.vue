<template lang="pug">
    .logout(@click="logout")
        i.material-icons.logout eject
        p  WYLOGUJ
</template>

<script>
export default {
    name: 'LogOut',
    data(){
        return{

        }
    },
    methods: {
        logout(){
            this.$store.dispatch('logout')
            .then(()=> {
                this.$store.commit('FLASH_MESSAGE', 'Pomyslnie wylogowano')
                this.$router.push({name: 'Login'})
            })
        }
    },
}
</script>

<style lang="scss">

.logout {
    display: flex;
    justify-content: center;
    align-items: center;

    p {
        padding-right: 20px;
    }
    
    i {
        color: black;
    }
}
    
</style>
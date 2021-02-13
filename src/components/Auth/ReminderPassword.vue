<template lang="pug">
    .authorization__login.login
        form(@submit.prevent="login").authorization__form
            .password.authorization__information.input-field
                label.email__label(for="password") Haslo
                input(type="password" name="password" v-model="user.password" ref="password" v-validate="'required|min:6'")
                .error(v-if="errors.has('password')").red-text Wprowadz ponownie haslo
            .password.authorization__information.input-field
                label.email__label(for="confirmPassword") Powtorz haslo
                input(type="password" name="confirmPassword" v-model="user.confirmPassword" v-validate="'required|confirmed:password'")
                .error(v-if="errors.has('confirmPassword')").red-text Hasla musza byc identyczne
            .error-container(v-if="errorInf" class="red-text") {{ errorInf }}
            button.authorization__information.btn.waves-effect.blue(v-if="!handled") Zmien haslo
            button.authorization__information.btn.waves-effect.blue(disabled v-else)
                LoadingCircle
            .authorization__reminder 
                .authorization__reminder--register 
                    router-link( :to="{name: 'Signup'}") Zarejestruj
                .authorization__reminder--remind 
                    router-link( :to="{name: 'Login'}") Zaloguj
        
</template>

<script>


export default {
    name: 'Login',
    data(){
        return{
            user: {
                password: null,
                confirmPassword: null
            },
            handled: null,
            errorInf: null
        }
    },
    methods: {
        async login(){
                await this.$validator.validateAll()
                .then(res => this.handled = res)
                if(!this.handled) return;
                await this.$store.dispatch('resetPassword', {
                    password: this.user.password,
                    token: this.$route.params.token
                    })
                .then(() => {
                    this.handled = null
                    this.$router.push({name: 'Login'})
                    })
                .catch(err => {
                    this.errorInf = err.response.data.message
                    this.handled = null
                })
            }
        
    },
}
</script>

<style lang="scss">


.authorization__reminder{
    width: 100%;
    margin-top: 20px;
    justify-content: space-around;
    display: flex;
}

    
</style>
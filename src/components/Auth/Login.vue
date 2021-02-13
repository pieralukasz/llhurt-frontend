<template lang="pug">
    .authorization__login.login
        form(@submit.prevent="login").authorization__form
            .email.authorization__information.input-field
                label.email__label(for="email") Email
                input(type="email" name="email" v-model="user.email" v-validate="'required|email'")
                .error(v-if="errors.has('email')").red-text Wprowadz poprawny email
            .password.authorization__information.input-field
                label.email__label(for="password") Haslo
                input(type="password" name="password" v-model="user.password" v-validate="'required|min:6'")
                .error(v-if="errors.has('password')").red-text Wprowadz poprawne haslo (wieksze niz 6 znakow)
            .error-container(v-if="this.$store.state.Flash.message") {{this.$store.state.Flash.message}}
            .error-container.btn.transparent.button-resend(@click.prevent="resendEmail" v-if="this.$store.state.Auth.email" class="blue-text") Wyslij mail ponownie
            button.authorization__information.btn.waves-effect.blue(v-if="!handled") Zaloguj
            button.authorization__information.btn.waves-effect.blue(disabled v-else)
                LoadingCircle
            .authorization__reminder 
                .authorization__reminder--register 
                    router-link(:to="{name: 'Signup'}") Zarejestruj
                .authorization__reminder--remind 
                    router-link(:to="{name: 'Reminder'}") Zapomniales hasla?
        
</template>

<script>

export default {
    name: 'Login',
    data(){
        return{
            user: {
                email: null,
                password: null
            },
            handled: null,
            emailFromRegister: this.$store.state.Auth.email ? true : false
        }
    },

    mounted() {
        if(this.$store.state.Flash.message) this.$store.commit('CLEAR_FLASH_MESSAGE')        
    },
    methods: {
        async login(){
                await this.$validator.validateAll()
                .then(res => this.handled = res)
                if(!this.handled) return;
                await this.$store.dispatch('login', {user: this.user})
                .then(() => {

                  if (this.user.email === 'admin@e-szlafrok.pl') {

                    this.$router.push({name: 'Admin'})

                  } else {

                    this.$router.push({name: 'Categories'})

                  }
                })
                .catch(() => this.handled = null)
        },

        async resendEmail() {
            await this.$store.dispatch('resendEmail', this.$store.state.Auth.email)
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

.button-resend {
    margin-top: 10px;
}

</style>
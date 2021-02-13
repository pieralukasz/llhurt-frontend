<template lang="pug">
       .authorization__signup.signup
        form(@submit.prevent="userRegister").authorization__form
            .NIP.authorization__information.input-field
                label.NIP__label(for="NIP") VAT / NIP
                input(type="number" name="NIP" v-model="user.NIP" v-validate="'required|min:6'")
                .error(v-if="errors.has('NIP')").red-text Minimum 6 liczb
            .email.authorization__information.input-field
                label.email__label(for="email") Email
                input(type="email" name="email" v-model="user.email" v-validate="'required|email'")
                .error(v-if="errors.has('email')").red-text Wprowadź poprawny email
            .password.authorization__information.input-field
                label.email__label(for="password") Haslo
                input(type="password" name="password" v-model="user.password" ref="password" v-validate="'required|min:6'")
                .error(v-if="errors.has('password')").red-text Wprowadź haslo wieksze niz 5 znakow
            .password.authorization__information.input-field
                label.email__label(for="confirmPassword") Powtórz haslo
                input(type="password" name="confirmPassword" v-model="user.confirmPassword" v-validate="'required|confirmed:password'")
                .error(v-if="errors.has('confirmPassword')").red-text Hasła musza byc identyczne
            .error-container(v-if="this.$store.state.Flash.message") {{this.$store.state.Flash.message}}
            button.authorization__information.btn.waves-effect.blue(v-if="!handled" type="submit") Zarejestruj
            button.authorization__information.btn.waves-effect.blue(disabled v-else)
                LoadingCircle
            .authorization__reminder.authorization__reminder--register
                .authorization__reminder__login 
                    a(href="/auth/login") Masz juz konto?

</template>



<script>


export default {
    
    name: 'Signup',
    data(){
        return{
            user: {
                NIP: null,
                email: null,
                password: null,
                confirmPassword: null,
            },
            handled: null,

        }
    },    
    async mounted() {
        if(this.$store.state.Flash.message) {
               this.$store.commit('CLEAR_FLASH_MESSAGE')             
        }
    },
    methods: {

        async userRegister(){      
                await this.$validator.validateAll()
                .then(res => this.handled = res)
                if(!this.handled) return;

                await this.$store.dispatch('register', {user: this.user})
                .then(() => {
                    this.$router.push({name:'Login'})
                    this.$store.commit('FLASH_MESSAGE', 'Rejestracja przebiegla pomyslnie, mozesz sie zalogowac!')
                    })
                .catch(() => {
                    this.handled = null
                    this.$store.commit('FLASH_MESSAGE', 'Uzytkownik juz istnieje!')
                    })
        },

        resendEmail() {
            this.$store.dispatch('resendEmail', {user: this.user})
        }
    },

}

</script>



<style lang="scss">

.authorization__reminder--register{
    padding-bottom: 20px;
}
.resendEmail {
    margin-top: 5px;


    &:hover {
        cursor: pointer;
    }
}

    
</style>
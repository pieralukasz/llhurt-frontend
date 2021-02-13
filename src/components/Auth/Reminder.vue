<template lang="pug">
    .authorization__forgot.forgot
        form(@submit.prevent="reminder").authorization__form
            .email.authorization__information.input-field
                label.email__label(for="email") Email
                input(type="email" name="email" v-model="email" v-validate="'required|email'")
                .error(v-if="errors.has('email')").red-text Wprowadz poprawny email
            .error-container(v-if="errorInf" class="red-text") {{ errorInf }}
            button.authorization__information.btn.waves-effect.blue(v-if="!handled") Wyslij email w celu potwierdzenia
            button.authorization__information.btn.waves-effect.blue(disabled v-else)
                LoadingCircle
            .authorization__reminder 
                .authorization__reminder--register 
                    a(href="/auth/signup") Zarejestruj
                .authorization__reminder--login 
                    a(href="/auth/login") Masz juz konto?
</template>

<script>

export default {
    name: 'Reminder',
    data(){
        return{
            email: null,
            handled: null,
            errorInf: null,
        }
    },
    methods: {
        async reminder(){
                await this.$validator.validateAll()
                .then(res => this.handled = res)
                if(!this.handled) return;

                await this.$store.dispatch('remind', {email: this.email})
                .then(() => this.handled = null)
            }
    }
}
</script>

<style lang="scss">

    
</style>
<template lang="pug">
    .authorization
        .authorization__positioning
            .authorization__content
                .authorization__card
                    img(src="../assets/lllogo.png", alt="alt")
                    router-view 
</template>

<script>
export default {
    name: 'Auth',
    data(){
        return{

        }
    },
    created() {
        const user = localStorage.getItem('user')
        if(user) this.$router.push({name: 'Categories'})
    },
}
</script>

<style lang="scss">

@import './style/breakpoints.scss';

.authorization {
    height: 100vh;
    background-color: rgb(243, 241, 241);
    font-family: 'Oswald', sans-serif;

    .btn {
        font-family: 'Oswald', sans-serif;
    }

    input {
        font-family: 'Oswald', sans-serif;
    }

    &__positioning {
        min-height: 100%;
        display: grid;

        @include mq($until: mobileSmall) {
            grid-template-columns: 5px 1fr 5px;
        }   
        @include mq($from: mobileSmall, $until: mobileBig) {
            grid-template-columns: 10px 1fr 10px;
        }   
        @include mq($from: mobileBig, $until: tablet) {
            grid-template-columns: 1fr 5fr 1fr;
        }   
        @include mq($from: tablet, $until: smallDesktop) {
            grid-template-columns: 1fr 4fr 1fr;
        } 
        @include mq($from: smallDesktop, $until: mediumDesktop) {
            grid-template-columns: 1fr 2fr 1fr;
        }   
        @include mq($from: mediumDesktop) {
            grid-template-columns: 1fr 1fr 1fr;
        }   
              
    }

    &__content {
        grid-column: 2/3;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    &__card {
        position: relative;
        width: 100%;
        padding-top: 20px;
        padding-bottom: 20px;
        background-color: white;
        border: 1px solid rgb(158, 156, 156);
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
        transition: 0.3s;

        img {

            @include mq($until: mobileSmall) {
                width: 100px;
            }   
            @include mq($from: mobileSmall, $until: mobileBig) {
                width: 150px;
            }   
            @include mq($from: mobileBig, $until: tablet) {
                width: 170px;
            }   
            @include mq($from: tablet) {
                width: 200px;
            } 
            
            position: absolute;
            left: 50%;
            border-radius: 50%;
            border: 1px solid rgb(158, 156, 156);
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
            transform: translate(-50%, -80%);
            transition: 0.3s;

            &:hover {
                border: 1px solid rgb(41, 40, 40);
                box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
            }
        }

        &:hover {
            border: 1px solid rgb(41, 40, 40);
            box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
        }
    }

    &__form {
        height: 90%;
        display: flex;
        flex-direction: column;
        padding-top: 10%;
        align-items: center;
    }

    &__information {
        width: 80%;

    }

    button {
        background: purple;
        margin-top: 20px;
    }  
}
    
</style>
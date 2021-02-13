<template lang="pug">
    .ordertime.container
        .order__information(v-if="basketSent")
            .order__information__photo.order__information--center Produkt
            .order__information__description.order__information--center Opis
            .order__information__EAN.order__information--center EAN.
            .order__information__quantity.order__information--center ilosc
            .order__information--center
        .order(v-if="basketSent")
            .order__item.order__row(v-for="(item, index) in basket" :key="item.ean") 
                .order__item__image 
                    img(:src="getPhoto(item.photo)", alt="cartphoto")
                .order__item__description
                    .description__category.description
                        div(v-if="!moreThan540") {{setCategory(item.category, index)}}
                        div {{item.name}}
                    .description__color.description
                        div(v-if="!moreThan540") Kolor: 
                        div {{item.color}}
                    .description__size.description 
                        div(v-if="!moreThan540") Rozmiar: 
                        div {{item.size}}
                .order__item__EAN
                    .EAN {{item.ean}}
                .order__item__quantity 
                 input(type="number" min="1" step="1" v-model="item.quantity" @input="changeValue(item)")
                .order__item__delete 
                    i.material-icons(@click="deleteOne(item.ean)") delete_outline
        .order__message(v-if="basketSent")
            .btn-large.blue__button(@click="leftMessage" v-if="!message.value") Dodaj wiadomość
            .btn-large.blue__button(@click="leftMessage" v-else) Edytuj wiadomość
        .order__confirm(v-if="basketSent")
            .btn-large.purple__button(@click="sendBasket") Zloz zamowienie do producenta
        .confirm-send(v-if="!basketSent") 
            div(style="text-align: center") Twoja zamowienie zostalo zlozone, mail potwierdzajacy znajduje sie w twojej skrzynce.
            div(@click="profilePush") 
                .material-icons arrow_right_alt
                .name Profil
        .order__message__input(v-if="message.visibility")
            .background__hide(@click="hideMessage")
            .order__message__container
                textarea(name="message" id="textarea1" placeholder="Wiadomość" v-model="message.value")
                .btn-large.button(@click="addMessage") Dodaj wiadomość

            
</template>

<script>

import slugify from 'slugify'

export default {
    name: 'Order',
    data() {
        return{
            moreThan540: window.innerWidth >= 540 ? false : true,
            basketSent: true,
            message: {
                visibility: false,
                value: "",
                error: ""
            }
        }
    },
    computed: {
        basket: function(){
            return this.$store.state.Product.basket
        }
    },
    created() {
        if(this.basket.length === 0) {
            this.$store.commit('CLEAR_BASKET')
            this.$router.push({name: 'Categories'})
            location.reload()
        }
    },
    mounted() {
        window.addEventListener('resize', () => {
            this.moreThan540 = window.innerWidth >= 540 ? false : true
        })
    },
    methods: {
        sendBasket() {

                if(this.basket.length > 0) {
                    this.$store.dispatch('sendBasket', this.message.value)
                    this.$store.commit('CLEAR_BASKET')
                    this.basketSent = false;
                }

        },
        getPhoto(photo) {

            const slug = slugify(photo, {
                replacement: '_',
                remove: /[$*+~.()'"!/\-:@]/g,
                lower: true
            })

            return this.$store.state.hostName + 'v2/file/image/' + slug + '.png'           

        },
        setCategory(cat){
            if (cat === "Szlafroki Damskie Dlugie") {
                return "Szlafrok Damski Dlugi"
            } else if (cat === "Szlafroki Damskie Krotkie") {
                return "Szlafrok Damski Krotki"
            } else if (cat === "Szlafroki Meskie") {
                return "Szlafrok Meski"
            } else if (cat === "Szlafroki Dzieciece") {
                return "Szlafrok Dzieciecy"
            } else if (cat === "Kombinezony") {
                return "Kombinezon"
            }
        },
        changeValue(product) {
            this.$store.dispatch('changeValue', product)
        },
        deleteOne(product) {
            this.$store.dispatch('deleteOne', product)
        },
        profilePush() {
            this.$router.push({name: 'User'})
            location.reload()
        },

        leftMessage() {
            this.message.visibility = true
        },

        hideMessage() {
            this.message.visibility = false
        },

        addMessage() {
            if(!this.message.value) {
                this.message.error = "Musisz wpisać wiadomość"
                document.getElementById('textarea1').setAttribute('placeholder', this.message.error)
            } else {
                this.message.visibility = false
            }
        }
    },
}
</script>

<style lang="scss">

@import '../../views/style/breakpoints.scss';

.order__message__input {
        position: absolute;
        left: 0;
        top:0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        
        .background__hide {
            position: absolute;
            left: 0;
            top:0;
            width: 100%;
            height: 100%;
            background-color: rgba(131, 131, 131, 0.432);  
            z-index: 1000;  
        }

        .order__message__container {

            z-index: 10000;

            width: 50%;
            height: 50%;
            max-width: 700px;

            @media (max-width: 900px) {
                width: 100%;
            }
            @media (max-width: 1300px) {
                width: 80%;
            }

            border: 1px solid rgb(179, 179, 179);
            box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
            background: rgb(255, 255, 255);

            position: relative;


            textarea {
                position: absolute;
                width: 90%;
                height: 60%;
                top: 10%;
                left: 50%;
                transform: translateX(-50%);
                padding: 20px;
                resize: none;

            }

            .button {
                position: absolute;
                bottom: 6%;
                left: 50%;
                transform: translateX(-50%);
                background-color: #9c27b0;
                transition: .3s;

                &:hover {
                    background: #8e5199;;
                }
            }

        }
}

.confirm-send {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.8rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgb(224, 224, 224);
    padding: 80px;
    border: 1px solid rgb(218, 212, 212);
    box-shadow: 4px 8px 16px 0 rgba(165, 163, 163, 0.2);
    text-transform: uppercase;

    div:nth-child(2) {
        display: flex;
        align-items: center;
        color: purple
    }
}

.ordertime {
    display: grid;
    grid-template-rows: 190px auto 100px;; 
    font-family: 'Oswald', sans-serif;
}

.order__information { 
    display: grid;
    align-self: end;
    margin-bottom: 5px;
    grid-template-columns: 90px 1fr 1fr 100px 60px;
        @include mq($until: 540px) {
                    grid-template-columns: repeat(5, 1fr);
        }  
    column-gap: 2px;
    text-transform: uppercase;

    &--center {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgb(223, 223, 223);
        padding: 5px;
        
    }

}
.order__confirm, .order__message {

    display: flex;
    justify-content: center;
    align-items: center;

    .blue__button {
        background-color: #6ed1f8;
        transition: .4s;

        &:hover {
            background-color: #44b6e4;
        }

        &:active {
            background-color: #b0b2b3;
        }
    }

    .purple__button {
        background-color: #9c27b0;
        transition: .4s;

        &:hover {
            background-color: #761c86;
        }
        &:active {
            background-color: #b0b2b3;
        }
    }


    
}


.order {

    display: grid;
    grid-template-rows: auto;
    grid-row: 2/3;
    font-size: 1rem;
    overflow-y: scroll;
    max-height: 500px;
    box-shadow: 4px 8px 16px 0 rgba(165, 163, 163, 0.2);


&::-webkit-scrollbar {
  width: 4px;
  height: 2px;
}
&::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
}
&::-webkit-scrollbar-thumb {
  background: #e1e1e1;
  border: 0px none #ffffff;
  border-radius: 50px;
}
&::-webkit-scrollbar-thumb:hover {
  background: #ffffff;
}
&::-webkit-scrollbar-thumb:active {
  background: #000000;
}
&::-webkit-scrollbar-track {
  background: #666666;
  border: 0px none #ffffff;
  border-radius: 36px;
}
&::-webkit-scrollbar-track:hover {
  background: #666666;
}
&::-webkit-scrollbar-track:active {
  background: #333333;
}
&::-webkit-scrollbar-corner {
  background: transparent;
}



    &__row {
        display: grid;
        grid-template-columns: 90px 1fr 1fr 100px 60px;
        @include mq($until: 540px) {
                    grid-template-columns: repeat(5, 1fr);
        }  
        column-gap: 2px;
    }


    &__item {
        // max-height: 200px;

        &__description {
            display: flex;
            flex-grow: 1;
            flex-wrap: wrap;
            padding: 20px;

            .description {
                flex-basis: 100%;
                display: flex;

                div:nth-child(2) {
                    margin-left: 10px;
                    color: rgb(184, 184, 185);
                }
            }
        }

        &__EAN {
            display: flex;
            align-items: center;
            justify-content: center;

            @include mq($until: 540px) {
                    font-size:0.8rem;
                    writing-mode: vertical-rl;
            }  
        
        }

        &__quantity {
            display: flex;
            align-items: center;
            justify-content: center;

            input {
                max-width: 60px;
            }
            @include mq($until: 540px) {
                    font-size:0.8rem;
            }  
        }

        &__delete  {
            display: flex;
            align-items: center;
            justify-content: center;   

            i {
                cursor: pointer;
            }     
        }
    }


    &__item__image {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;

        img {
            margin: 8px;
            width: 80%;
            box-shadow: 4px 8px 16px 0 rgba(165, 163, 163, 0.2);
        }
    }

}
    
</style>
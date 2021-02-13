<template lang="pug">
    .user.container
        .user__container
            .user__information(v-if="!order")
                .user__information__email EMAIL: {{user.email}}
                .user__information__NIP NIP: {{user.NIP}}
            .user__headline {{orderHeadline}}
            .user__orders.webkit-scroll(v-if="!order")
                .user__orders__order(v-for="(order, index) in basket" :key="order.order_id")
                    .user__orders__order__quantity.item(@click="showOrder(order)") Ilosc: {{ countQuantity(order.basketItems) }}
                    .user__orders__order__id.item(@click="showOrder(order)") ID: {{ order.order_id}}
                    .user__orders__order__date.item(@click="showOrder(order)") {{translateDate(order.createdAt)}}
                    .user__orders__order__sendAgain.item(@click="sendAgain(order, false)")
                        .btn.purple Wyślij_Email
            .user__pick__order(v-if="order")
                .user__pick__nav
                    .nav__photo.item Produkt
                    .nav__info.item Opis
                    .nav__ean.item ean
                    .nav__quantity.item ilosc
                .user__pick_products(v-for="(item, index) in order" :key="index")
                    .pick__photo 
                        img(:src="getPhoto(item.photo)", alt="alt")
                    .pick__details 
                        .pick__details__name
                            .title(v-if="!moreThan540") {{setCategory(item.category, index)}}
                            .name.grey-text {{item.name}}
                        .pick__details__color
                            .title(v-if="!moreThan540") Kolor: 
                            .name {{item.color}}
                        .pick__details__size
                            .title(v-if="!moreThan540") Rozmiar:
                            .name {{item.size}}
                    .pick__ean 
                        .ean {{item.ean}}
                    .pick__quantity 
                        .quantity {{item.quantity}}
            .backer 
                i.material-icons(@click="refreshProfile" v-if="order") call_missed



            


</template>

<script>

import moment from 'moment';
import slugify from 'slugify'

export default {
    name: 'User',
    data() {
        return{
            orderHeadline: 'Zamowienia',
            moreThan540: window.innerWidth >= 540 ? false : true,
            basket: null,
            order: null,
            user: JSON.parse(localStorage.getItem('user'))
        }
    },
    mounted() {
        window.addEventListener('resize', () => {
            this.moreThan540 = window.innerWidth >= 540 ? false : true
        })
    },
    async created() {

        const response = await this.$store.dispatch('getOrders')

        if(response.basket.length === 0) this.orderHeadline = 'Nie masz zadnych zamowien'
        
        this.basket = response.basket

    },
    methods: {
        getPhoto(photo) {

            const slug = slugify(photo, {
                replacement: '_',
                remove: /[$*+~.()'"!/\-:@]/g,
                lower: true
            })

            return this.$store.state.hostName + 'v2/file/image/' + slug + '.png'           

        },
        translateDate(date) {
            return moment(date).format('LL');
        },
        countQuantity(products) {

            let quantity = 0
            
            for (const item of products) {
                quantity += parseInt(item.quantity)
            }
            
            return quantity
        },
        showOrder(order) {
            
            this.order = order.basketItems
            this.orderHeadline = `Zamowienie: ${order.order_id}`
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
        refreshProfile() {
            this.order = null;
            this.orderHeadline = `Zamowienia`
        },
        sendAgain(order) {
            this.$store.dispatch('sendAgain', order)
        }

    },
}
</script>

<style lang="scss">

@import '../../views/style/breakpoints.scss';
.user {
    padding-top: 110px;
    display: grid;
    grid-template-rows: 90px auto 100px;; 
    font-family: 'Oswald', sans-serif;

    .user__container {
        position: relative;
        grid-row: 2/3;
        box-shadow: 4px 8px 16px 0 rgba(165, 163, 163, 0.2);
    }

    .user__pick__order {
        display: flex;
        flex-direction: column;

        .user__pick__nav {
        display: grid;
        grid-template-columns: 100px 1fr 1fr 100px;
        column-gap: 1px;
        @include mq($until: 540px) {
                    grid-template-columns: repeat(4, 1fr);
        }  

            .item {
                font-size: 1rem;
                padding: 3px;
                background: rgb(216, 216, 216);
                text-align: center;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

        }

        .user__pick_products {
        display: grid;
        grid-template-columns: 100px 1fr 1fr 100px;
        column-gap: 1px;
        margin: 3px;

        @include mq($until: 540px) {
                    grid-template-columns: repeat(4, 1fr);
        } 

            .pick__photo  {
                display: flex;
                justify-content: center;
                align-items: center;

                img {
                    margin: 6px;
                    width: 85%;
                    box-shadow: 4px 8px 16px 0 rgba(165, 163, 163, 0.2);
                }   
                
            }

            .pick__details {
                display: flex;
                align-items: center;
                flex-wrap: wrap;

                .pick__details__name {
                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;

                    .name {
                        color: grey;
                        margin-left: 10px;
                    }
                }

                .pick__details__color {
                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    .name {
                        color: grey;
                        margin-left: 10px;
                    }
                }

                .pick__details__size {
                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    .name {
                        color: grey;
                        margin-left: 10px;
                    }
                }
            }
            .pick__ean {
                display: flex;
                justify-content: center;
                align-items: center;

                @include mq($until: 540px) {
                    writing-mode: vertical-rl;
            }  
            }
            .pick__quantity {
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }

    .user__information {
        font-size: 1.4rem;
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        justify-content: space-evenly;
        margin-top: 15px;
    }

    .user__headline {
        width: 100%;
        padding: 20px 0 20px;
        font-size: 1.3rem;
        text-transform: uppercase;
        color: purple;
        text-align: center;
    }

    .user__orders {

        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-y: scroll;
        max-height: 400px;

        .user__orders__order {
            background-color: #ac87ac;
            border-radius: 10px;
            margin: 7px;
            width: 90%;
            padding: 0 20px 0 20px;
            cursor: pointer;
            color: white;
            letter-spacing: 1px;
            display: grid;
            line-height: 70px;
            font-size: 1.1rem;
            grid-template-columns: repeat(4, 1fr);
            box-shadow: 0 4px 8px 0 rgba(165, 163, 163, 0.2);
            border: 1px solid rgb(206, 194, 194);
            transition: .3s;
            @include mq($until: 540px) {
                grid-template-columns: 1fr;
                grid-template-rows: (3, 1fr);
                line-height: 40px;
            }  

            &:hover {
                    background-color: #af90af;
                    box-shadow: 0 16px 8px 0 rgba(165, 163, 163, 0.2);
            }

            .user__orders__order__id {
                text-transform: uppercase;
            }
            .item {
                text-align: center;
            }
            .user__orders__order__sendAgain{
                z-index: 20;
            }
        }
    }


}

.backer {
    cursor: pointer;
    position: absolute;
    right: 3%;
    top: 3%;
}

.webkit-scroll {

        &::-webkit-scrollbar {
          width: 2px;
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
          border-radius: 50px;
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

}
</style>
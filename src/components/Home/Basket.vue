<template lang="pug">
    .basket(:class="{ basket__active: basketView}")
        .welcome(v-if="basketView")
            p.center.purple-text Koszyk
        .item-container(v-if="basketView, basketItems.length > 0")
            .basket-item(v-if="basketView" v-for="(basketItem, index) in basketItems" :key="index")
                img(:src="getPhoto(basketItem.photo)", alt="alt")
                .item-info.red-text
                    .name.item 
                        div {{basketItem.name}}
                    .color.item
                        div Kolor:  
                        div {{ basketItem.color}}
                    .size.item 
                        div Rozmiar: 
                        div {{ basketItem.size}}
                    .count.item 
                        div.counter Ilosc: 
                        input(type="number" min="1" step="1" v-model="basketItem.quantity" @input="changeValue(basketItem, basketItem.quantity)")
                    i.deleteone.material-icons(@click="deleteOne(basketItem.ean)") delete_outline
        .item-inform(v-else)
            div.black-text Koszyk jest pusty, dodaj cos!
        .confirm(v-if="basketView, basketItems.length > 0")
            .btn.confirm_basket(@click="pushOrder") Przejdz do zamowienia

</template>


<script>

import slugify from 'slugify'
import Loading from '../Loading/LoadingCircle'

export default {
    name: 'Basket',
    data() {
        return{
            activeBtn: true,
        }
    },
    components: {
        Loading
    },
    props: ['basketView'],
    computed: {
        basketItems: function() {
            return this.$store.state.Product.basket
        },

        order: function() {
            return this.$router.history.current.name
        }
    },
    methods: {
        sendBasket() {
                this.disabled()
                this.$store.dispatch('sendBasket')
            
        },
        getPhoto(photo) {

            const slug = slugify(photo, {
                replacement: '_',
                remove: /[$*+~.()'"!/\-:@]/g,
                lower: true
            })

            return this.$store.state.hostName + 'v2/file/image/' + slug + '.png'           

        }, 
        changeValue(product) {
            this.$store.dispatch('changeValue', product)
        },
        disabled() {
            if(this.basketItems.length > 0) {
                this.activeBtn = false;
                setTimeout(() => {
                    this.activeBtn = true;
                }, 3000);
            }
        },
        deleteOne(product) {
            this.$store.dispatch('deleteOne', product)
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
        pushOrder() {

            if(this.order !== "Order") {
                this.$router.push({name: 'Order'})
                location.reload();
            }
        }
    },

}
</script>

<style lang="scss">

@import '../../views/style/breakpoints.scss';   

.item-container {
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
        height: 350px;
}

.basket {
    position: absolute;
    width: 300px;
    max-width: 400px;

        @include mq($until: 330px) {
        width: 300px;
        .item-info {
            padding-left:10px;
            overflow: hidden;
        }
    }   
        @include mq($from: mobileSmall, $until: mobileBig) {
        width: 95%;
        .item-info {
                padding-left:20px;
        }
    }   
        @include mq($from: mobileBig) {
        width: 400px;
        .item-info {
                padding-left:40px;
        }    
    }   

    right: -90%;
    top: 0;
    transition: .5s;
    font-family: 'Oswald', sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .welcome {
        font-size: 2rem;
        padding: 10px;
        text-transform: uppercase;
    }

    &__active {
    
    z-index: 10;
    border: 1px solid rgb(182, 175, 175);
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
    overflow: hidden;
    right: 10px;
    top: 120%;
    background: rgb(247, 246, 246);
    transition: .3s;


    .item-container{
        width: 95%;
        align-self: flex-end;

        .basket-item{
            display: flex;
            margin: 10px;

            img {
                width: 100px;
                box-shadow: 4px 8px 16px 0 rgba(165, 163, 163, 0.2);
                border: 1px solid rgb(209, 202, 202);
                max-height: 150px;
                transition: .3s;

                &:hover {

                    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
                    border: 1px solid rgb(148, 147, 147);

                }
            }
            
            .item-info {
                margin: 10px;
                width: 100%;
                position: relative;
                
                
                .item {
                    height: 32px;
                    
                }

                .name {
                    font-size: 1.4rem;
                    margin-top: -20px;
                    text-align: center;
                    color: rgb(34, 34, 44);
                }
                
                .color {
                    display: flex;
                    font-size: 1.2rem;
                    width: 150px;

                    div:nth-child(1) {
                        color: rgb(34, 34, 44);
                    }

                    div:nth-child(2) {
                        margin-left: 20px;
                        color: rgb(184, 184, 185);
                        font-size: 0.98rem;
                    }
                }

                .size {
                    display: flex;
                    font-size: 1.2rem;
                    justify-content: space-between;
                    width: 100px;
                    color: black;
                  

                    div:nth-child(2) {
                        font-size: 1rem;
                        color: rgb(184, 184, 185);
                    }

                    @include mq($until: mobileSmall) {

                        justify-content: space-evenly;
                    }   

                    

                }

                .count {
                    display: flex;
                    // justify-content: space-evenly;
                    align-items: center;
                    margin-top: 15px;
                    font-size: 1.2rem;
                    color: black;
                    
                    input {
                        height: 32px;
                        width: 50px;
                        margin-top: 9px;
                        margin-left: 20px;
                        text-align: center;
                    }
                }
            }
        }

        
    }

.confirm_basket {
    background: purple;
}

.deleteone {
    position: absolute;
    left: 85%;
    top: 35%;
}

}}


    
</style>
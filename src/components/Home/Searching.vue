<template lang="pug">
    .searching
        .center
            .back(@click="backToPrevious") Cofnij
        .searching-container
            div.image-box(v-for="filtered in filterProducts" :key="filtered.name" @click="showMore(filtered.name)" v-if="!currentProductsParents")
                .pcontainer
                    div.name.center {{setCategory(filtered.category)}} {{filtered.name}} 
                img.smallimage(:src="getPhoto(filtered.details[0].photo)", alt="PHOTO")
            div.image-box(v-for="product in currentProductsParents" :key="product.photo" @click="showProduct(product.photo)" v-if="!sizes")
                .pcontainer 
                    div.name.center {{setCategory(product.category)}} {{editName(product.name)}} 
                    div.name.purple-text.center {{editName(product.color)}} 
                img.smallimage(:src="getPhoto(product.photo)", alt="PHOTO")
            div.image-box(v-for="(product, index) in sizes" :key="index"  v-if="sizes")
                .pcontainer
                    div.name.center {{setCategory(product.category)}}  {{product.name}}
                    div.name.purple-text {{editName(product.color)}} {{editName(product.size)}} 
                    div.name.quantity
                        input(type="number" min="1" step="1" v-model="product.quantity")
                        .btn(@click="addToBasket(product)")  Zamow
                img.smallimage(:src="getPhoto(product.photo)", alt="PHOTO")               
</template>

<script>

import slugify from 'slugify'

export default {
    name: 'Searching',
    data(){
        return{
            newArray: [],
            currentProduct: [],
            sizes: null,
            currentProductsParents: null,
        }
    },
    created() {
        for (const category of this.categories) {
            for (const products of category.products) {
                this.newArray.push(products)
                for(const details of products.details) {
                    for (const ean of details.product) {
                        this.currentProduct.push({
                            ean: ean.EAN,
                            size: ean.size,
                            name: products.name,
                            color: details.color,
                            photo: details.photo,
                            category: products.category,
                            quantity: 1,
                        })
                    }
                }
            }
        }
    },
    props: ['categories'],
    computed: {
        searcher: function() {
            return this.$store.state.Product.searcherInfo
        },
        filterProducts: function() {     
            return this.newArray.filter((product) => {

                if (product.name.match(this.searcher)) {
                    return product.name.match(this.searcher)
                } 
                else if (product.category.match(this.searcher)) {
                    return product.category.match(this.searcher)
                } 
            }) 
        },
        path: function() {
            return this.$store.state.Product.path
        }
    },
    watch: {
        searcher: function(val, oldVal){
            if(oldVal !== val) {
                this.sizes = null;
                this.currentProductsParents = null;
            }
        }

    },
    methods: {
        backToPrevious() {

            if(this.currentProductsParents) {
                if(this.currentProductsParents.length === 0) {
                    this.sizes = null;
                    this.showMore(this.path[0])
                    this.$store.commit('DELETE_PATH')
                    return;
                } else {
                    this.$store.commit('SET_SEARCHER', this.path[this.path.length - 1])
                    this.sizes = null;
                    this.currentProductsParents = null;
                }
            } else {
                this.$store.commit('SET_SEARCHER')
                this.$store.commit('CLEAR_PATH')
            }

        },
        addToBasket(product) {
            this.$store.dispatch('changeValue', product)
            this.$store.commit('ADD_TO_BASKET', product)
        },
        
        showMore(name) {
            this.currentProductsParents = []
            for (const product of this.newArray) {
                if(product.name === name) {
                    this.currentProductsParents = product.details
                    this.$store.commit('SET_PATH', product.name)   
                }
            }

            console.log(this.currentProductsParents);

        },

        editName(photo) {
            const slug = slugify(photo, {
                replacement: ' ',
                remove: /[!/\-:@]/g,
            })
            return slug.toString().replace('_', ' ').replace('_', ' ').replace('_', ' ').replace('.', ' ')
        },

        showProduct(photo) {
            let sizes = [];
            this.currentProductsParents = []
            for (const product of this.currentProduct) {
                if(product.photo === photo) {
                    sizes.unshift(product)
                    this.sizes = sizes
                }
            }

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
        getPhoto(photo) {
            
            const slug = slugify(photo, {
                replacement: '_',
                remove: /[$*+~.()'"!/\-:@]/g,
                lower: true
            })

            return this.$store.state.hostName + 'v2/file/image/' + slug + '.png'         

        },

    },

}
</script>

<style lang="scss" >

@import '../../views/style/breakpoints.scss';

.back {
    margin-top: 15px;
    font-size: 1.4rem;
    text-transform: uppercase;

    &:hover {
        cursor: pointer;
    }
}

.searching-container {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;

    :hover {
        // opacity: 80%;
        .addToBasket {
            z-index: 2;
        }
    }



    .pcontainer  {
        font-family: 'Oswald', sans-serif;
        display: flex;
        flex-direction: column;
        justify-content: center;
        
        align-items: center;

        &:first-child {
            margin-top: 10px;
        }

        .quantity {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            width: 70%;

            input {
                width: 30%;
                text-align: center;
                @include mq($until: tablet) {
                    width: 30%;
                    margin-right: 5px;
                }   

            }

                @include mq($until: tablet) {
                    justify-content: center;
                }   
            

            .btn {
                
                text-align: center;
                background: purple;
                transition: .3s;

                &:hover  {
                    background: rgb(204, 76, 204);
                }

                &:active {
                    color: black;
                }
            }
        
        


        }

        
    }

    .addToBasket {
        position: absolute;
        left: 50%;
        bottom: 20%;
        transform: translateX(-50%);
        background-color: rgb(238, 238, 238);
        border: 1px solid rgb(207, 205, 205);
        box-shadow: 4px 8px 16px 0 rgba(165, 163, 163, 0.2);
        width: 50%;
        height: 30px;
        z-index: -1;
        cursor: pointer;
        
        p {
            color: rgb(50, 74, 75);
            text-align: center;
            line-height: 25px;
            font-family: 'Oswald', sans-serif;
        }

        @include mq($until: 460px) {
        bottom: 35%;
        }   

        @include mq($from: 460px, $until: 600px) {
        bottom: 25%;
        }  

    }
}

.image-box {
    margin: 20px;
    position: relative;
    display: flex;
    flex-direction: column-reverse;
    height: 100%;
    width: 215px;
    @include mq($until: tablet) {
        width: 33%;

        .smallimage {
            width: 100%;
        }
    }   
    
}

.smallimage {
    width: 215px;
    box-shadow: 4px 8px 16px 0 rgba(165, 163, 163, 0.2);
    transition: 0.3s;
    // border: 1px solid rgb(206, 194, 194);
    cursor: pointer;

    &:hover {
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
    }
}

.basketexist {
    margin-bottom: 15%;
}

.back {
    font-family: 'Oswald', sans-serif;
}

body {
    background-color: rgba(250, 246, 246, 0.651);
}

input[type=number]::-webkit-inner-spin-button {
  opacity: 1;
}

    
</style>    
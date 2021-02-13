<template lang="pug"> 
    .box-container
        Card(:categories="categories" v-if="!this.$store.state.Product.searcherInfo")
        Searching(v-else :categories="categories")
</template>

<script>

import Card from './Card'
import Searching from './Searching'
import Szlafroki_Damskie_Dlugie from '../../assets/Szlafroki_Damskie_Dlugie.png'
import Szlafroki_Damskie_Krotkie from '../../assets/Szlafroki_Damskie_Krotkie.png'
import Szlafroki_Meskie from '../../assets/Szlafroki_Meskie.png'
import Szlafroki_Dzieciece from '../../assets/Szlafroki_Dzieciece.png'
import Kombinezony from '../../assets/Kombinezony.png'

import Product from '../../Product/Product'
import slugify from 'slugify'

export default {
    name: 'Boxer',
    data(){
        return{
            categories: [
                {
                    category: 'Szlafroki Damskie Dlugie',
                    src: Szlafroki_Damskie_Dlugie,
                    products: []
                }, 
                {
                    category: 'Szlafroki Damskie Krotkie',
                    src: Szlafroki_Damskie_Krotkie,
                    products: []
                }, 
                {
                    category: 'Szlafroki Meskie',
                    src: Szlafroki_Meskie,
                    products: []
                }, 
                {
                    category: 'Kombinezony',
                    src: Kombinezony,
                    products: []
                }, 
                {
                    category: 'Szlafroki Dzieciece',
                    src: Szlafroki_Dzieciece,
                    products: []
                }
            ],
        }
    },
    components: {
        Card,
        Searching
    },
    async created() {

        let products = [];
        let newProduct = null;
        let usedProducts = [[],[],[],[],[]]
        products = await this.$store.dispatch('getProducts')

        const addProduct = (name, color, photo, size, category) => {
            newProduct = new Product(name, this.categories[category].category)
            newProduct.addDetails(color, photo, size)
            usedProducts[category].push(name)
            this.categories[category].products.push(newProduct)
        }

        const checkAll = (name, color, photo, size, category) => {
            if(this.categories[category].products.length > 0){
                let temporaryIndex = usedProducts[category].indexOf(name)
                    if(temporaryIndex >= 0) {
                        let isOn = false;
                            for (const [index, iterator] of this.categories[category].products[temporaryIndex].details.entries()) {
                                if(iterator.color === color){
                                    isOn = true
                                    this.categories[category].products[temporaryIndex].details[index].product.push(size)
                                }
                            }
                        if(!isOn) this.categories[category].products[temporaryIndex].addDetails(color, photo, size)
                } else addProduct(name, color, photo, size, category)
            } else addProduct(name, color, photo, size, category)
        }

        await products.forEach((el) => {
            let photoReplaced = (el.Nazwa[0] + '_' + el.Kolor[0]).split(' ').join('_')

            //never move

            let size = slugify(el.Rozmiar[0], {
                replacement: '',
                remove: /[$*+~.()'"!/\-:@]/g,
            })

            let sizeEAN = {
                size, 
                EAN: el.$.EAN
            }

            switch (el.NazwaKategorii[0]) {
                case "SZLAFROK DAMSKI DŁUG":
                    checkAll(el.Nazwa[0], el.Kolor[0], photoReplaced, sizeEAN, 0)     
                    break;
                case "SZLAFROK DAMSKI ":
                    checkAll(el.Nazwa[0], el.Kolor[0], photoReplaced, sizeEAN, 1) 
                    break;
                case "SZLAFROK MĘSKI":
                    checkAll(el.Nazwa[0], el.Kolor[0], photoReplaced, sizeEAN, 2)  
                    break;
                case "KOMBINEZON":
                    checkAll(el.Nazwa[0], el.Kolor[0], photoReplaced, sizeEAN, 3)  
                    break;
                case "SZLAFROK DZIECIECY":
                    checkAll(el.Nazwa[0], el.Kolor[0], photoReplaced, sizeEAN, 4)  
                    break;
                default:
                    break;
        }})
    },
}
</script>

<style lang="scss" >

@import '../../views/style/breakpoints.scss';

.box-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 70px;
}

.boxer {
    width: 92%;
    max-width: 1250px; 
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
}

.generate-card {
    cursor: pointer;
    margin: 10px;
    max-width: 795px;
 
    @include mq($from: 906px, $until: smallDesktop) {
        max-height: 597px;      
    }   
    @include mq($from: smallDesktop, $until: mediumDesktop) {
        width: 31%;    
            
        &:nth-child(1), &:nth-child(2) {
            width: 47%;
        }
    }
    @include mq($from: mediumDesktop) {
        width: 31%;    
        max-width: 450px;
            
        &:nth-child(1), &:nth-child(2) {
            width: 48%;
            max-width: 650px;
        }   
    }   
}
</style>
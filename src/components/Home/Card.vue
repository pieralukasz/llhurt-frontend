<template lang="pug">
    .boxer
        .card.generate-card(v-for="(category, index) in replaceCategories" :key="index" @click="addState(category.category)")
            img.background(alt="alt" :src="category.src")

</template>

<script>



export default {
    name: 'Card',
    data(){
        return{
           replaceCategories: this.categories,
        }
    },
    methods: {
        addState(category) {
            
            this.$store.commit('SET_SEARCHER', category)
            this.$store.commit('SET_PATH', category)
        }
    },
    props: ['categories']

}
</script>

<style lang="scss" >


.card {
    position: relative;
    max-height: 598px;
    min-width: 270px;
    box-shadow: 0 4px 8px 0 rgba(165, 163, 163, 0.2);
    transition: .3s;
    border: 1px solid rgb(206, 194, 194);

    &:hover {
        box-shadow: 16px 4px 8px 0 rgba(20, 20, 20, 0.384);
        border: 1px solid rgb(43, 43, 43);
    }

}



.background {
    width: 100%;
    display: block;
}


    
</style>
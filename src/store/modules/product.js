import axios from 'axios'

const productURL = 'http://localhost:8082/api/v2/file'

// const productURL = 'http://e-szlafrok.xaa.pl/api/v2/file'

// const productURL = 'https://llhurt.herokuapp.com/api/v2/file'

export default {

    state:  {
        searcherInfo: null,

        path: [],

        basket: JSON.parse(localStorage.getItem('basket')) ? JSON.parse(localStorage.getItem('basket')) : [],
        
    },

    actions: {

        async getProducts() {

            let products = null

            await axios.get(`${productURL + '/getxmlapi'}`)
            .then(res => products = res.data)

            return products
        },

        async sendBasket({commit}, data) {

            const message = data

            const local = JSON.parse(localStorage.getItem('user'));
            const basket = JSON.parse(localStorage.getItem('basket'))

            await axios.post(`${productURL + '/basket'}`, {local, basket, message})
            .then(() => commit('CLEAR_BASKET'))
        },

        async deleteOne({commit, state}, data) {

            let newArr = []

            for (const basketItem of state.basket) {
                if(basketItem.ean !== data) newArr.push(basketItem)
            }

            commit('SET_NEW', newArr)
        },

        async changeValue({commit, state}, data) {

            let newArr = []


            for (const basketItem of state.basket) {
                if(basketItem.ean === data.ean){
                    newArr.push(data)
                } else {
                    newArr.push(basketItem)
                }
            }

            commit('SET_NEW', newArr)
        },

        async getOrders() {

            const token = JSON.parse(localStorage.getItem('user')).token

            let response = null

            await axios.post(`${productURL + '/orders'}`, {token})
                    .then(res => response = res.data)

            return response

        },

        async sendAgain(state, date) {

            await axios.post(`${productURL + '/send-again'}`, date)

        },

        async sendPhotoToBackend(state, date) {
            await axios.post(`${productURL + '/upload-image'}`, date, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(res => console.log(res.data))
        },

        async deletePhotoFromBackend(state, date) {
            console.log(date)
            await axios.post(`${productURL + '/delete-image'}`, {date})
                .then(res => console.log(res.data))
        }
    },

    mutations: {

        SET_PATH (state, path) {

            state.path.unshift(path)

        },

        DELETE_PATH (state) {

            state.path.shift()

        },

        CLEAR_PATH (state) {

            state.path = []
        },

        SET_SEARCHER (state, searcher) {

            state.searcherInfo = searcher

        }, 

        SET_NEW (state, products) {

            state.basket = products

            localStorage.setItem('basket', JSON.stringify(products))

        },

        CLEAR_BASKET (state) {

            state.basket = []

            localStorage.removeItem('basket')

        },

        ADD_TO_BASKET (state, product) {

            const exist = JSON.parse(localStorage.getItem('basket'))

            if(exist) {

                for (const existance of exist) {
                    if(existance.ean === product.ean) {
                        console.log('Produkt juz jest w koszyku');
                        return;
                    }
                }

                exist.push(product)

                state.basket = exist

                localStorage.setItem('basket', JSON.stringify(exist))

            } else {

                state.basket = [product]

                localStorage.setItem('basket', JSON.stringify([product]))
            }
        }
    }
}
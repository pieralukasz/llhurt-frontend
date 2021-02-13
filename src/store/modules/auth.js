import axios from 'axios'

const authURL = 'http://localhost:8082/api/v1/auth'

// const authURL = 'http://e-szlafrok.xaa.pl/api/v1/auth'

// const authURL = 'https://llhurt.herokuapp.com/api/v1/auth'

export default {

    state:  {

        user: null,

        email: JSON.parse(localStorage.getItem('email')) || null

    },

    actions: {

        async register({commit}, data) {
            await axios.post(`${authURL + '/register'}`, data)
            .then(res => {commit('SET_EMAIL_CONFIRM', res.data)})
            
        },


        async login({commit}, data) {

        await axios.post(`${authURL + '/login'}`, data)
                .then(({data}) => {commit('SET_USER_DATA', data)})
        },

        async logout({commit}) {
            await commit('CLEAR_USER_DATA')
        },

        async token(){
            await axios.get(`${authURL + '/home'}`)
        },

        async adminToken(){
            await axios.get(`${authURL + '/admin'}`)
        },

        async remind(context, data) {

            await axios.post(`${authURL + '/password/email'}`, data)
        },

        async resetPassword(context, data) {

            await axios.post(`${authURL + '/password/reset'}`, data)
        },

        async emailConfirm({commit}, data) {

            await axios.post(`${authURL + '/email/confirm'}`, data)
            .then(() => {commit('CLEAR_EMAIL_CONFIRM')})
        },

        async resendEmail(context, data) {
            await axios.post(`${authURL + '/email/resend'}`, data)

        }



    },

    getters: {

        loggedIn(state) {
            return !!state.user
        }

    },

    mutations: {

        SET_USER_DATA (state, userData) {
            state.user = userData
            localStorage.setItem('user', JSON.stringify(userData))
            axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`
        },
        CLEAR_USER_DATA () {
            localStorage.removeItem('user')
            axios.defaults.headers.common['Authorization'] = null 
            location.reload()
        }, 
        SET_EMAIL_CONFIRM (state, email) {
            state.email = email
            localStorage.setItem('email', JSON.stringify(email))
        },
        CLEAR_EMAIL_CONFIRM (state) {
            state.email = null
            localStorage.removeItem('email')
        }

    }
}
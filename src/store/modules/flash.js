export default {
    state: {

        message: localStorage.getItem('message') || null,

    },

    mutations: {
        
        FLASH_MESSAGE (state, message) {

            localStorage.setItem('message', message)

            console.log(message);

            state.message = message

        },

        CLEAR_FLASH_MESSAGE (state) {

            setTimeout(() => {

                localStorage.removeItem('message')

                state.message = null

            }, 3000);
        }
    }
}
<template lang="pug">
.navbar
    .hidder(v-if="hamburgerActive")
    nav.navbar__container(onselectstart="return false;")
        .navbar__hamburger(v-if="moreThan740")
            i.material-icons(@click="showMenu") menu
        .navbar__categories(@click="stateClear" v-else).black-text L&LHURT
        .navbar__searcher(v-if="searcherActive")
            input.inline(v-model="searcher" @input="showSeacher")
        .navbar__profile(v-if="!moreThan740" @click="profilePush")
            Logout Wylogowanie
            i.material-icons person
            p Profil
        .navbar__cart(v-if="routerName !== 'Order'")
            i.material-icons.navbar__cart--icon(@click="showCart") shopping_cart
            p.navbar__cart--counter {{basketLength.length}}
            Basket(:basketView="basketView" v-if="!hamburgerActive")
        .navbar__cart(v-else) 
            i.material-icons(@click="stateClear") call_missed
    .hamburger__menu.hamburger__menu( :class="{ hamburger__menu__active: hamburgerActive}" onselectstart="return false;")
        ul
            div.cafel(@click="showCategories") Kategorie
            div.categories(:class="{ categories__active: categoryActive}" v-if="categoryActive")
                ul.categories__container.center
                    li(v-for="(cat, index) in categories" :key="index")(@click="setSearcher(cat)") {{ cat }}
            div.cafel(@click="profilePush") Profil
            div.cafel 
                Logout Wylogowanie
        
</template>

<script>

import Logout from '../Auth/LogOut'
import Basket from '../Home/Basket'
import debounce from 'lodash.debounce'

export default {
    name: 'Navbar',
    data(){
        return{
            moreThan600: window.innerWidth >= 600 ? true : false,
            moreThan740: window.innerWidth >= 740 ? false : true,
            hamburgerActive: false,
            categoryActive: false,
            categories: 
            ['Szlafroki Damskie Dlugie', 
            'Szlafroki Damskie Krotkie', 
            'Szlafroki Meskie', 
            'Kombinezony', 
            'Szlafroki Dzieciece'],
            searcher: this.$store.state.Product.searcherInfo,
            searcherActive: true,
            basketView: false,
        }
    },
    components: {
        Logout,
        Basket
    },

    computed: {
        basketLength: function() {
            return this.$store.state.Product.basket
        },
        routerName: function() {
            return this.$router.history.current.name
        }
    },

    mounted() {
        this.activeCategories()
       
        window.addEventListener('resize', () => {
            this.moreThan600 = window.innerWidth >= 600 ? true : false
            this.moreThan740 = window.innerWidth >= 740 ? false : true
        })
    },
    created() {
        if(this.routerName === 'Order' || this.routerName === 'User') {
            this.searcherActive = false;
        }
    },
    methods: {

        activeCategories() {
            const categories = document.querySelectorAll('.cafel')
            
            for(let i = 0; i < categories.length; i++) {
                categories[i].addEventListener('click', (e) => {
                    e.target.classList.add('cafel--active')

                    setTimeout(() => {
                        e.target.classList.remove('cafel--active')
                    }, 200);
                })
            }
        },
        stateClear() {
            this.$store.commit('SET_SEARCHER', null)
            this.$store.commit('CLEAR_PATH')
            this.searcher = null;
            if(this.routerName === "Order" || this.routerName === "User" ){
                this.$router.push({name: 'Categories'})
                location.reload()
            }
        },  
        showSeacher: debounce (function() {
            this.$store.commit('SET_SEARCHER', this.searcher) 
        }, 500),

        setSearcher(cat) {
            this.$store.commit('SET_SEARCHER', cat)
            this.hamburgerActive = false;
        },
        showMenu() {
            this.hamburgerActive = !this.hamburgerActive;
            
            window.addEventListener('click', (e) => {
                const hidderWidth = window.innerWidth * 0.6
                
                if(e.clientX > hidderWidth) {
                    this.hamburgerActive = false;
                }
            })
        },
        showCategories() {
            this.categoryActive = !this.categoryActive;
            this.stateClear()
        },

        showCart() {
            this.basketView = !this.basketView

            const basket = document.querySelector('.basket')
            let basketRect= null

            setTimeout(() => {basketRect = basket.getBoundingClientRect()}, 301);

            if(this.basketView) {

                setTimeout(() => {

                window.addEventListener('click', (e) => {
                    if((e.clientX < basketRect.x)) {
                        this.basketView = false
                    } else if (e.clientY > (basketRect.y + basketRect.height)) {
                        this.basketView = false
                    } else if (e.clientX > (basketRect.x + basketRect.width)) {
                        this.basketView = false
                    } 
                })        

                }, 301);
            }

        }, 
        profilePush() {
            this.$router.push({name: 'User'})
            location.reload();
        }

    },

}
</script>

<style lang="scss" >

@import '../../views/style/breakpoints.scss';


.image {
    
    img {
        position: absolute;
        width: 150px;
        border: 1px solid rgb(211, 205, 205);
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
        border-radius: 50%;
        right: 60%;
        top: 20%;
        transform: translateX(60%)
    }
}

.navbar {
    z-index: 800;
    position: fixed;
    width: 100%;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
}

.navbar__container {
    display: grid;
    
        @include mq($until: mobileSmall) {
        grid-template-columns: 70px 180px 1fr 60px 40px;
    }   
        @include mq($from: mobileSmall, $until: mobileBig) {
        grid-template-columns: 50px 1fr 60px;
    }   
        @include mq($from: mobileBig, $until: tablet) {
        grid-template-columns: 50px 200px 1fr 60px;
    }   
        @include mq($from: tablet, $until: smallDesktop) {
        grid-template-columns: 200px 200px 1fr 60px;
    } 
        @include mq($from: smallDesktop, $until: mediumDesktop) {
        grid-template-columns: 200px 200px 1fr 60px;
    }   
        @include mq($from: mediumDesktop) {
         grid-template-columns: 200px 200px 1fr 60px;
    }   

    width: 100%;
    min-height: 64px;
    background: white;
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.1);
}

.navbar__hamburger{
    display: flex;
    justify-content: center;
    align-items: center;
    grid-column: 1/2;
    cursor: pointer;

        i {
            cursor: pointer;
            color: rgb(63, 61, 61);
    }
}

.navbar__searcher {
    display: flex;
    justify-content: center;
    align-items: center;
    grid-column: 2/3;
    
    input  {
        width: 80%;
    }
}

.navbar__cart {
    display: flex;
    grid-column: 4/5;
    justify-content: space-evenly;
    align-items: center;

    i {
        cursor: pointer;
        color: rgb(63, 61, 61);
    }

    &:hover {
        color: white;
    }

    p {
        margin-right: 10px;
        text-align: center;
        // font-weight: bold;
        color: rgb(206, 87, 180);
    }
}

.hamburger__menu {
    position: absolute;
    width: 60%;
    height: 100vh;
    left: -60%;
    top: 0;
    transition: .2s;
}

.hamburger__menu__active {
    z-index: 3;
    box-shadow: 16px 8px 16px 0 rgba(0,0,0,0.2);
    overflow: hidden;
    left: 0%;
    top: 0;
    border-right: 1px solid rgb(177, 175, 175);
    background: rgb(238, 236, 236);
}

.hidder {
    z-index: 2;
    position: absolute;
    cursor: pointer;
    width: 100vw;
    height: 100vh;
    opacity: 50%;
    background: rgb(49, 46, 46);
}

.categories__active {
    width: 100%;

  .categories__container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

        li {
            font-family: 'Oswald', sans-serif;
            text-transform: uppercase;
            padding: 10px;
        }
  }
}

.cafel {
    text-align: center;
    font-size: 1.5rem;
    text-transform: uppercase;;
    font-family: 'Oswald', sans-serif;
    color: rgb(100, 92, 92);
    margin: 10px;
    transition: .3s;
    cursor: pointer;

    ul li {
        cursor: pointer;
    }
}

.cafel--active  {
    background: rgb(187, 199, 223);
    color: rgb(255, 255, 255);
}

.navbar__profile {
    position: relative;
    margin-right: 15px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    

        p {
            // font-weight: bold;
            font-family: 'Oswald', sans-serif;
            text-transform: uppercase;
            cursor: pointer;
            color: black
        }

        i {
        cursor: pointer;
        color: rgb(63, 61, 61);
    }

}

.navbar__categories {
    cursor: pointer;
    font-size: 1.3rem;
    text-align: center;
    // font-weight: bold;
    font-family: 'Oswald', sans-serif;
    text-transform: uppercase;
}

.touch__text--active {

    color: white;
    background-color: rgb(132, 132, 192);
    padding: -20px;
    
}



</style>
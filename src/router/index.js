import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Auth from '../views/Auth.vue'
import Admin from '../views/Admin.vue'
import Login from '../components/Auth/Login.vue'
import Signup from '../components/Auth/Signup.vue'
import Categories from '../components/Home/Main.vue'
import EmailConfirm from '../components/Auth/EmailConfirm.vue'
import Reminder from '../components/Auth/Reminder.vue'
import ReminderPassword from '../components/Auth/ReminderPassword.vue'
import Order from '../components/Home/Order.vue'
import User from '../components/Home/User.vue'

Vue.use(VueRouter)

const routes = [
    {
    path: '/',
    redirect: {name: 'Categories'}
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true},
    children: [
      {
        path: 'main',
        name: 'Categories',
        component: Categories
      },
      {
        path: 'order',
        name: 'Order',
        component: Order
      },
      {
        path: 'user',
        name: 'User',
        component: User
      }
    ]
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true}
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth,

      children: [
        {
          path: 'login',
          name: 'Login',
          component: Login
        },
        {
          path: 'signup',
          name: 'Signup',
          component: Signup
        },
        {
          path: 'signup/confirm/:token',
          name: 'EmailConfirm',
          component: EmailConfirm
        },
        {
          path: 'reminder',
          name: 'Reminder',
          component: Reminder
        },
        {
          path: 'reminder/password/:token',
          name: 'ReminderPassword',
          component: ReminderPassword
        }
      ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {

  const loggedIn = localStorage.getItem('user')

  if(to.matched.some(record => record.meta.requiresAuth) && !loggedIn) next('/auth/login')

  next()
  
})


export default router

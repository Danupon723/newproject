import { createRouter, createWebHistory } from 'vue-router'
import Login from './view/login.vue'
import Register from './view/register.vue'

import AdminLayout from "./layouts/AdminLayout.vue"
import adminDashboard from "../src/view/admin/dashbard.vue"
import adminusers from "../src/view/admin/users.vue"


const routes = [
  { path: '/', name : Login,  component: Login },
  { path: '/register',name : Register ,  component: Register } , 
  {
    path: '/admin' , 
    component : AdminLayout , 
    children:[
         { path: '', redirect: '/admin/dashboard' },
         { path: "dashboard", component: adminDashboard },
         { path: "users", component: adminusers },
    ] , 
  } , 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

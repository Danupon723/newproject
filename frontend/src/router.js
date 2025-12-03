import { createRouter, createWebHistory } from 'vue-router'
import Login from './view/login.vue'
import Register from './view/register.vue'

import AdminLayout from "./layouts/AdminLayout.vue"
import adminDashboard from "../src/view/admin/dashbard.vue"
import adminusers from "../src/view/admin/users.vue"
import topic from './view/admin/topic.vue'
import edittopic from './manage/edittopic.vue'
import dashbord from './view/user/dashbord.vue'
import userlayout from './layouts/userlayout.vue'
import Assessorlayout from './layouts/Assessorlayout.vue'
import assessordashbord from './view/Assessor/dashbord.vue'
import Subtopic from './view/admin/Subtopic.vue'
import adduser from './manage/adduser.vue'
import addmaintopic from './manage/addmaintopic.vue'
import addtopic from './manage/addtopic.vue'
import addevalua from './manage/addevalua.vue'
import edituser from './manage/edituser.vue'
import addsubtopic from './manage/addsubtopic.vue'
import profile from './view/user/profile.vue'
import { components } from 'vuetify/dist/vuetify.js'
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
         {path: "topic" , component: topic},
         {path: "edittopic" , component:edittopic},
         {path: "subtopic" , component:Subtopic},
         {path: "adduser" , component:adduser},
         {path: "addmaintopic" , component:addmaintopic},
         {path: "addtopic" , component:addtopic},
         {path:"addevalua" , component:addevalua},
         {path: "edituser" , component:edituser},
         {path: "addsubtopic" , component:addsubtopic},
    ] , 
     meta: { requiresAuth: true}
  } , 
  {
    path: '/user' , 
    component : userlayout , 
    
    children:[
         { path: '', redirect: '/user/dashboard' },
         { path: "dashboard", component: dashbord },
         { path: "profile", component: profile },
    ] , 
     meta: { requiresAuth: true}
  } , 
  {
    path: '/Assessor' , 
    component : Assessorlayout , 
    
    children:[
         { path: '', redirect: '/assessor/dashboard' },
         { path: "dashboard", component: assessordashbord },
    ] , 
     meta: { requiresAuth: true}
  } , 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/')   // ❌ ไม่มี token → กลับไปหน้า login
  } else {
    next()           // ✅ มี token → เข้าได้
  }
})

export default router

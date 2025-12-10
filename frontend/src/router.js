import { createRouter, createWebHistory } from 'vue-router'
import Login from './view/login.vue'
import Register from './view/register.vue'


//ส่วนadmin
import AdminLayout from "./layouts/AdminLayout.vue"
import adminDashboard from "../src/view/admin/dashbard.vue"
import adminusers from "../src/view/admin/users.vue"
import topic from './view/admin/topic.vue'
import edittopic from './manage/edittopic.vue'
import dashbord from './view/user/dashbord.vue'
import userlayout from './layouts/userlayout.vue'

import Subtopic from './view/admin/Subtopic.vue'
//ส่วนเพิ่มข้อมูล
import adduser from './manage/adduser.vue'
import addmaintopic from './manage/addmaintopic.vue'
import addtopic from './manage/addtopic.vue'
import addevalua from './manage/addevalua.vue'
import edituser from './manage/edituser.vue'
import addsubtopic from './manage/addsubtopic.vue'

//ส่วนuser
import profile from './view/user/profile.vue'
import Editprofileuser from './view/user/Editprofileuser.vue'
import Export from './view/user/Export.vue'
import information from './view/user/information.vue'
import score from './view/user/score.vue'
import estimate from './view/user/estimate.vue'
import testupload from './view/testupload.vue'

//ส่วนของผู้ประเมิน
import topicass from './view/Assessor/topicass.vue'
import Assessorlayout from './layouts/Assessorlayout.vue'
import assessordashbord from './view/Assessor/dashbord.vue'
import subtopic from './view/Assessor/subtopic.vue'
import userass from './view/Assessor/user.vue'

const routes = [
  { path: '/', name : Login,  component: Login },
  { path: '/testupload', name : testupload,  component: testupload },
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
         { path: '', redirect: '/user/profile' },
         {path:'profile' , component:profile},
         { path: "dashboard", component: dashbord },
         {path:'Editprofile' , component:Editprofileuser},
         {path:'Export' , component:Export},
         {path:'information' , component:information},
         {path:'score' , component:score},
         {path:'estimate' , component:estimate},
    ] , 
     meta: { requiresAuth: true}
  } , 
  {
    path: '/Assessor' , 
    component : Assessorlayout , 
    
    children:[
         { path: '', redirect: '/assessor/dashboard' },
         { path: "dashboard", component: assessordashbord },
         {path: 'topicass' , component: topicass},
         {path:'subtopic' , component:subtopic},
         {path:'userass' , component:userass},
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

<template>
  <v-app>


    <!-- Navbar -->
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>ยินดีต้อนรับ ผู้ประเมิน </v-toolbar-title> <v-btn color="write" class="d-flex justify-center mt-4" style="background-color: red;" @click="logout">ออกจากระบบ</v-btn>
      
    </v-app-bar>
    <!-- Sidebar -->
    <v-navigation-drawer app permanent>
      <v-list>
        <v-list-item link to="/assessor/dashboard">
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/assessor/userass">
          <v-list-item-title>Users</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/admin/topic">
          <v-list-item-title>topic</v-list-item-title>
        </v-list-item>
        <v-list-item @click="logout()" >
          <v-list-item-title >logout</v-list-item-title>
        </v-list-item>
        <!-- เพิ่มลิงก์อื่น ๆ -->
      </v-list>
    </v-navigation-drawer>
    <!-- เนื้อหาหลัก -->
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import {useRouter} from 'vue-router' ; 
const router = useRouter()
// ไม่มี state พิเศษตอนนี้ 
function logout(){
  localStorage.removeItem('token')
  router.replace('/') 
}


</script>

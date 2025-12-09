<template>
  <v-app>

    <!-- Navbar -->
    <v-app-bar app color="primary" dark>
      <!-- ปุ่มเมนูสำหรับมือถือ -->
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-toolbar-title>ยินดีต้อนรับ เเอดมิน</v-toolbar-title> 
      <v-btn color="write" class="d-flex justify-center mt-4" style="background-color: red;" @click="logout">
        ออกจากระบบ
      </v-btn>
    </v-app-bar>

    <!-- Sidebar -->
    <v-navigation-drawer
      app
      v-model="drawer"
      :permanent="!isMobile"
    >
      <v-list>
        <v-list-item link to="/admin/dashboard">
          <v-list-item-title>แดชบอร์ด</v-list-item-title>
        </v-list-item>

        <v-list-item link to="/admin/users">
          <v-list-item-title>ตารางเเสดงชื่อผู้ใช้</v-list-item-title>
        </v-list-item>

        <v-list-item link to="/admin/topic">
          <v-list-item-title>หัวข้อการประเมินหลัก</v-list-item-title>
        </v-list-item>

        <v-list-item link to="/admin/Subtopic">
          <v-list-item-title>หัวข้อตัวชี้วัด</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/admin/Indicator">
          <v-list-item-title>หัวข้อการประเมินย่อย</v-list-item-title>
        </v-list-item>

        <v-list-item link to="/admin/evaluatorrole">
          <v-list-item-title>กำหนดผู้ประเมิน</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- เนื้อหาหลัก -->
    <v-main>
      <router-view />
    </v-main>

  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ตัวควบคุม drawer
const drawer = ref(true)

// ตรวจว่าหน้าจอมือถือไหม
const isMobile = ref(false)

const checkScreen = () => {
  isMobile.value = window.innerWidth <= 900
  drawer.value = !isMobile.value // มือถือ = ปิดอัตโนมัติ
}

onMounted(() => {
  checkScreen()
  window.addEventListener('resize', checkScreen)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreen)
})

function logout() {
  localStorage.removeItem('token')
  router.replace('/')
}
</script>

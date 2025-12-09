<template>
  <v-app>


    <!-- Navbar -->
    <v-app-bar app color="primary" dark>
<v-toolbar-title>ยินดีต้อนรับ ผู้ใช้</v-toolbar-title> <v-btn color="write" class="d-flex justify-center mt-4" style="background-color: red;" @click="logout">ออกจากระบบ</v-btn>
    </v-app-bar>
    <!-- Sidebar -->
    <v-navigation-drawer app permanent>
      <v-list>
        <v-list-item link to="/user/profile">
          <v-list-item-title>โปรไฟล์ผู้ใช้</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/user/dashboard">
          <v-list-item-title>หน้าหลัก</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/user/evaluate">
          <v-list-item-title>หัวข้อประเมิน</v-list-item-title>
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
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const router = useRoute()

// ไม่มี state พิเศษตอนนี้ 
function logout(){
  localStorage.removeItem('token')
  router.replace('/') 
}

const user = ref([]) // เปลี่ยนจาก [] เป็น {}

async function loaddata() {
  try {
    const res = await axios.get('http://localhost:7000/api/evaluatee/profile')
    if (res.data && res.data.length > 0) {
      user.value = res.data[0] // เอาผู้ใช้คนแรก
    }
    console.log('โหลดข้อมูลสำเร็จ:', user.value)
  } catch (e) {
    console.log('โหลดข้อมูลไม่สำเร็จ', e)
  }
}

onMounted(() => {
  loaddata()
})

</script>

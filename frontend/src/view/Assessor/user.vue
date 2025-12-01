<template>
  <v-container>
    <h2 class="text-h5 mb-4">Dashboard ผู้ใช้งาน</h2>

    <!-- ตารางแสดงข้อมูล -->
    <v-data-table
      :headers="headers"
      :items="users"
      :loading="loading"
      class="elevation-1"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>รายชื่อผู้ใช้งาน</v-toolbar-title>
         <router-link to="adduser"><v-btn color="primary">เพิ่มผู้ใช้</v-btn></router-link> 
        </v-toolbar>
      </template>

      <!-- ช่องสถานะ Active -->
      <template #item.active="{ item }">
        <v-chip
          :color="item.active === 'ใช้งาน' ? 'green' : 'red'"
          text-color="white"
          size="small"
        >
          {{ item.active }}
        </v-chip>
      </template>

      <!-- ปุ่มจัดการ -->
      <template #item.actions="{ item }">
        <v-btn icon @click="editUser(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>

        <v-btn icon color="red" @click="deleteUser(item.id)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const users = ref([])
const loading = ref(false)

// <!-- ✅ ส่วนหัวตาราง (ตรง DB 100%) -->
const headers = [
  { text: 'ID', value: 'id' },
  { text: 'ชื่อ', value: 'name' },
  { text: 'อีเมล', value: 'email' },
  { text: 'รหัสแผนก', value: 'department_id' },
  { text: 'สถานะ', value: 'active' },
  { text: 'จัดการ', value: 'actions', sortable: false },
]

// <!-- ✅ ฟังก์ชันดึงข้อมูลจากฐานข้อมูล -->
const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await axios.get('http://localhost:7000/api/auth/users')

    console.log('API RESPONSE:', res.data) // ✅ ใช้เช็กกรณีมีปัญหา

    users.value = res.data.data.map(user => ({
      ...user,
      active: user.active === 1 ? 'ใช้งาน' : 'ปิดใช้งาน'
    }))
  } catch (err) {
    console.error('Error fetching users:', err)
  } finally {
    loading.value = false
  }
}

const editUser = (user) => {
  alert(`แก้ไขผู้ใช้: ${user.name}`)
}

const deleteUser = async (id) => {
  if (!confirm('คุณต้องการลบผู้ใช้นี้หรือไม่?')) return

  try {
    await axios.delete(`http://localhost:7000/api/auth/users/${id}`)
    fetchUsers() 
  } catch (err) {
    console.error('Error deleting user:', err)
  }
}

onMounted(fetchUsers)
</script>

<style scoped>
.v-data-table {
  margin-top: 20px;
}
</style>

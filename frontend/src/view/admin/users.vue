<template>
  <v-container>
    <h2 class="text-h5 mb-4">Dashboard ผู้ใช้งาน</h2>

    <v-data-table
      :headers="headers"
      :items="users"
      :loading="loading"
      item-key="id"
      class="elevation-1"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>รายชื่อผู้ใช้งาน</v-toolbar-title>
        <v-btn icon color="primary" @click="adduser">
        <v-icon>mdi-pencil</v-icon>
        </v-btn>
        </v-toolbar>
      </template>


      <!-- ✅ สถานะ -->
      <template #item.active="{ item }">
        <v-chip
          :color="item.active === 'ใช้งาน' ? 'green' : 'red'"
          text-color="white"
          size="small"
        >
          {{ item.active }}
        </v-chip>
        
      </template>
      <template #item.index="{ index }">
        {{ index + 1 }}
      </template>

      <!-- ✅ ปุ่มจัดการ -->
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
import { useRouter } from 'vue-router'

const router = useRouter()
const users = ref([])
const loading = ref(false)


//ตัวเเปรเเก้ไขข้อมูล

const editdialog = ref(false)//ควบคุมการเปิดปิดของ dialog
const editusers = ref({})// เก็บข้อมูลผู้ใช้ที่เลือก

//ฟังชั้นเปิด dialog 
const openEditDialog = (user) => {
  editUserData.value = { ...user }  // clone ข้อมูลเพื่อแก้ไข
  editDialog.value = true           // เปิด Dialog
}

// <!-- ✅ ส่วนหัวตาราง (ตรง DB 100%) -->
const headers = [
   { title: 'ลำดับ', key: 'index' },
  { title: 'อีเมล', key: 'email' },
  { title: 'ชื่อ',  key: 'name' },
  { title: 'ตำเเหน่ง',  key: 'role' },
  { title: 'แผนก',  key: 'department_id' },
  { title: 'กลุ่ม',  key: 'group_id' },
  { title: 'สถานะ',  key: 'active' },
  { title: 'จัดการ',  key: 'actions', sortable: false }
]

// <!-- ✅ ฟังก์ชันดึงข้อมูลจากฐานข้อมูล -->
const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await axios.get('http://localhost:7000/api/admin/userlist')

    console.log('API RESPONSE:', res.data) // ✅ ใช้เช็กกรณีมีปัญหา

    users.value = res.data.map(user => ({
      ...user,
      active: user.active === 1 ? 'ใช้งาน' : 'ปิดใช้งาน'
    }))
  } catch (err) {
    console.error('Error fetching users:', err)
  } finally {
    loading.value = false
  }
}

const updateUser = async () => {
  try {
    await axios.put(`http://localhost:7000/api/admin/users/${editUserData.value.id}`, editUserData.value)
    fetchUsers()           // โหลดข้อมูลใหม่หลังอัพเดท
    editDialog.value = false
  } catch (err) {
    console.error('อัพเดทไม่สำเร็จ', err)
  }
}


const adduser = (user) => {
  router.push('adduser')
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

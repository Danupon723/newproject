<template>
  <v-container fluid>
    <h3 class="text-h5 mb-6">ตารางเเสดงผลข้อมูล</h3>

    <!-- การ์ดสรุปข้อมูล -->
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="pa-4" elevation="3">
          <h3>ผู้ใช้งาน ทั้งหมด</h3>
          <h2 class="text-primary">128 คน</h2>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4" elevation="3">
          <h3>ผู้ประเมิน</h3>
          <h2 class="text-success">32 คน</h2>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4" elevation="3">
          <h3>แบบประเมิน</h3>
          <h2 class="text-warning">8 รายการ</h2>
        </v-card>
      </v-col>
    </v-row>

    <!-- ✅ ตารางพร้อมปุ่มแก้ไข + ลบ -->
    <v-card class="mt-6">
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
    </v-card>
  </v-container>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const users = ref([])


// ✅ ตรวจ token กันหลุดเข้า admin
onMounted(() => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.replace('/')
  }
})

// ✅ หัวตาราง (เพิ่มคอลัมน์ "จัดการ")
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

//ฟังชั้นเรียกข้อมูลจากฐานข้อมูล

const  loaddata = async() => {
  try{
    const res = await axios.get('http://localhost:7000/api/admin/userlist')
    console.log('success' , res.data)
    
    users.value = res.data
  }catch(e){
    console.log(e)
  }
}




// ✅ ฟังก์ชันแก้ไข
const editUser = (user) => {
  router.push('edituser')
}

// ✅ ฟังก์ชันลบ
const deleteUser = (user) => {
  if (!confirm(`คุณต้องการลบ ${user.name} ใช่หรือไม่?`)) return

  users.value = users.value.filter(u => u !== user)
}


onMounted(() => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.replace('/')
  }

  loaddata()  // ✅ เรียกฟังก์ชันโหลดข้อมูล
})
</script>

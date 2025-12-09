<template>
  <v-container>

    <v-data-table
      :headers="headers"
      :items="users"
      :loading="loading"
      item-key="id"
      class="elevation-1"
    >
      <template #top>
         <v-toolbar flat>
            <v-toolbar-title>เเสดงรายงานประเมิน</v-toolbar-title>
          </v-toolbar>
      </template>

      <template #item.index="{ index }">
        {{ index + 1 }}
      </template>

      <!-- ปุ่มจัดการ -->
      <template #item.actions="{ item }">
        <v-btn icon @click="openEditDialog(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <!-- Dialog -->
    <v-dialog v-model="editDialog" max-width="500">
      <v-card>
        <v-card-title>
          แก้ไขผู้ใช้: {{ editUserData.name }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editUserData.name"
            label="ชื่อผู้ใช้"
          />
          <v-text-field
            v-model="editUserData.email"
            label="อีเมล"
          />
          <v-text-field
            v-model="editUserData.role"
            label="บทบาท"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="editDialog = false">ยกเลิก</v-btn>
          <v-btn color="primary" @click="updateUser">บันทึก</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const users = ref([])
const loading = ref(false)

// ตัวแปร popup
const editDialog = ref(false)
const editUserData = ref({})

// ส่วนหัวตาราง
const headers = [
   { title: 'ลำดับ', key: 'index' },
  { title: 'หัวข้อการประเมิน', key: 'title_th' },
  { title: 'คำอธิบาย',  key: 'description' },
  { title: 'จัดการ',  key: 'actions', sortable: false }
]

// ดึงข้อมูลผู้ใช้ / หัวข้อ
const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await axios.get('http://localhost:7000/api/admin/topiclist')
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

// เปิด popup
const openEditDialog = (user) => {
  editUserData.value = { ...user } // clone ข้อมูล
  editDialog.value = true
  
}

// อัพเดทข้อมูล
const updateUser = async () => {
  try {
    await axios.put(`http://localhost:7000/api/admin/users/${editUserData.value.id}`, editUserData.value)
    fetchUsers()           
    editDialog.value = false
  } catch (err) {
    console.error('อัพเดทไม่สำเร็จ', err)
  }
}

onMounted(fetchUsers)
</script>

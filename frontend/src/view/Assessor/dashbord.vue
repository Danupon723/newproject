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
      <v-card-title>รายชื่อผู้ใช้ล่าสุด</v-card-title>

      <v-data-table
        :headers="headers"
        :items="users"
        class="elevation-1"
      >
        <!-- ✅ ปุ่มจัดการ -->
        <template #item.actions="{ item }">
          <v-btn
            icon
            color="warning"
            size="small"
            class="me-2"
            @click="editUser(item)"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>

          <v-btn
            icon
            color="red"
            size="small"
            @click="deleteUser(item)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ✅ ตรวจ token กันหลุดเข้า admin
onMounted(() => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.replace('/')
  }
})

// ✅ หัวตาราง (เพิ่มคอลัมน์ "จัดการ")
const headers = [
  { title: 'ชื่อ', key: 'name' },
  { title: 'อีเมล', key: 'email' },
  { title: 'สถานะ', key: 'status' },
  { title: 'จัดการ', key: 'actions', sortable: false }
]

// ✅ ข้อมูลตัวอย่าง
const users = ref([
  { name: 'สมชาย', email: 'somchai@gmail.com', status: 'active' },
  { name: 'สมหญิง', email: 'somying@gmail.com', status: 'active' },
  { name: 'อดิศร', email: 'adisorn@gmail.com', status: 'inactive' }
])

// ✅ ฟังก์ชันแก้ไข
const editUser = (user) => {
  router.push('edit')
}

// ✅ ฟังก์ชันลบ
const deleteUser = (user) => {
  if (!confirm(`คุณต้องการลบ ${user.name} ใช่หรือไม่?`)) return

  users.value = users.value.filter(u => u !== user)
}
</script>

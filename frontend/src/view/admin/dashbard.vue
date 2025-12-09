<template>
  <v-container fluid>
    <h3 class="text-h5 mb-6">ตารางเเสดงผลข้อมูล</h3>

    <!-- ✅ การ์ดสรุปข้อมูล (ไม่ลบ ไม่แก้) -->
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="pa-4" elevation="3">
          <h3>ผู้ใช้งาน ทั้งหมด</h3>
          <h2 class="text-primary">{{ users.length }} คน</h2>
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

    <!-- ตารางผู้ใช้งาน -->
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

        <template #item.active="{ item }">
          <v-chip
            :color="item.active === 'ใช้งาน' ? 'green' : 'red'"
            text-color="white"
            size="small"
          >
            {{ item.active }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <v-btn icon @click="openEditDialog(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon color="red" @click="deleteUser(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- ✅ Popup แก้ไข -->
    <v-dialog v-model="editDialog" max-width="600px">
      <v-card class="pa-6">
        <h2 class="text-h5 mb-4">แก้ไขข้อมูลผู้ใช้</h2>

        <v-form @submit.prevent="updateUser">
          <v-text-field
            label="อีเมล"
            v-model="editUserData.email"
            type="email"
            variant="outlined"
            class="mb-3"
          />

          <v-text-field
            label="ชื่อผู้ใช้"
            v-model="editUserData.name"
            variant="outlined"
            class="mb-3"
          />

          <!-- ✅ แก้ตรงนี้: แผนก -->
          <v-select
            v-model="editUserData.department_id"
            :items="departments"
            item-title="name"
            item-value="id"
            label="แผนก"
            variant="outlined"
            class="mb-3"
          />

          <!-- ✅ แก้ตรงนี้: กลุ่ม -->
          <v-select
            v-model="editUserData.group_id"
            :items="groups"
            item-title="name"
            item-value="id"
            label="กลุ่ม"
            variant="outlined"
            class="mb-3"
          />

          <v-btn type="submit" color="primary" block class="mt-4">
            บันทึก
          </v-btn>
          <v-btn
            color="grey"
            block
            class="mt-2"
            @click="editDialog = false"
          >
            ย้อนกลับ
          </v-btn>
        </v-form>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const users = ref([])
const loading = ref(false)

const editDialog = ref(false)
const editUserData = ref({})

const departments = ref([])
const groups = ref([])

const headers = [
  { title: 'ลำดับ', key: 'id' },
  { title: 'อีเมล', key: 'email' },
  { title: 'ชื่อ', key: 'name' },
  { title: 'ตำแหน่ง', key: 'role' },
  { title: 'แผนก', key: 'depart_name' },
  { title: 'กลุ่ม', key: 'group_name' },
  { title: 'สถานะ', key: 'active' },
  { title: 'จัดการ', key: 'actions', sortable: false }
]

// ✅ โหลด users
const loadUsers = async () => {
  loading.value = true
  try {
    const res = await axios.get('http://localhost:7000/api/admin/userlist')
    users.value = res.data.map(u => ({
      ...u,
      active: u.active === 1 ? 'ใช้งาน' : 'ปิดใช้งาน'
    }))
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

// ✅ โหลด แผนก + กลุ่ม
const loadMasterData = async () => {
  try {
    const dept = await axios.get('http://localhost:7000/api/admin/dept')
    departments.value = dept.data   // { id, name }

    const group = await axios.get('http://localhost:7000/api/admin/grop')
    groups.value = group.data       // { id, name }
  } catch (e) {
    console.error(e)
  }
}

const openEditDialog = user => {
  editUserData.value = {
    ...user,
    department_id: user.department_id,
    group_id: user.group_id
  }
  editDialog.value = true
}

const updateUser = async () => {
  try {
    await axios.put(
      `http://localhost:7000/api/admin/users/${editUserData.value.id}`,
      editUserData.value
    )
    alert('บันทึกสำเร็จ')
    editDialog.value = false
    loadUsers()
  } catch (e) {
    console.error(e)
    alert('บันทึกไม่สำเร็จ')
  }
}

const deleteUser = user => {
  if (!confirm(`ลบ ${user.name} ใช่หรือไม่`)) return
  users.value = users.value.filter(u => u.id !== user.id)
}

onMounted(() => {
  const token = localStorage.getItem('token')
  if (!token) router.replace('/')
  loadUsers()
  loadMasterData()
})
</script>

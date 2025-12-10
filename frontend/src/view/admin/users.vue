<template>
  <v-container fluid>
    <!-- ✅ ตาราง -->
    <v-card class="mt-6">
      <v-data-table
        :headers="headers"
        :items="users"
        item-key="id"
      >
        <template #item.index="{ index }">
          {{ index + 1 }}
        </template>

        <!-- สถานะ -->
        <template #item.active="{ item }">
          <v-chip
            :color="item.active === 1 ? 'green' : 'red'"
            text-color="white"
            size="small"
          >
            {{ item.active === 1 ? 'ใช้งาน' : 'ปิดใช้งาน' }}
          </v-chip>
        </template>

        <!-- ปุ่ม -->
        <template #item.actions="{ item }">
          <v-btn icon @click="openEdit(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>

          <v-btn icon color="red" @click="deleteUser(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- ✅ Popup แก้ไข -->
    <v-dialog v-model="editDialog" max-width="500">
      <v-card class="pa-4">
        <v-card-title class="text-h6">แก้ไขผู้ใช้งาน</v-card-title>

        <v-form @submit.prevent="updateUser">
          <v-text-field
            label="อีเมล"
            v-model="editUser.email"
            variant="outlined"
            class="mb-3"
          />

          <v-text-field
            label="ชื่อ"
            v-model="editUser.name"
            variant="outlined"
            class="mb-3"
          />

          <v-text-field
            label="ตำแหน่ง"
            v-model="editUser.role"
            variant="outlined"
            class="mb-3"
          />

          <v-select
            label="เเผนก"
            :items="[
              { title: 'ใช้งาน', value: 1 },
              { title: 'ปิดใช้งาน', value: 0 }
            ]"
            v-model="editUser.active"
            variant="outlined"
          />
          <v-select
            label="กลุ่ม"
            :items="[
              { title: 'ใช้งาน', value: 1 },
              { title: 'ปิดใช้งาน', value: 0 }
            ]"
            v-model="editUser.active"
            variant="outlined"
          />
          <v-select
            label="สถานะ"
            :items="[
              { title: 'ใช้งาน', value: 1 },
              { title: 'ปิดใช้งาน', value: 0 }
            ]"
            v-model="editUser.active"
            variant="outlined"
          />

          <v-btn type="submit" color="primary" block class="mt-4">
            บันทึก
          </v-btn>

          <v-btn
            block
            variant="tonal"
            class="mt-2"
            @click="editDialog = false"
          >
            ยกเลิก
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
const editDialog = ref(false)
const editUser = ref({})

// ✅ เพิ่ม
const departments = ref([])
const groups = ref({})

// ✅ หัวตาราง
const headers = [
  { title: 'ลำดับ', key: 'index' },
  { title: 'อีเมล', key: 'email' },
  { title: 'ชื่อ', key: 'name' },
  { title: 'ตำแหน่ง', key: 'role' },
  { title: 'แผนก', key: 'department_id' },
  { title: 'กลุ่ม', key: 'group_id' },
  { title: 'สถานะ', key: 'active' },
  { title: 'จัดการ', key: 'actions', sortable: false }
]

// ================== LOAD DATA ==================
const loaddata = async () => {
  const res = await axios.get('http://localhost:7000/api/admin/userlist')
  users.value = res.data
}

// ✅ โหลดแผนก
const loadDepartments = async () => {
  const res = await axios.get('http://localhost:7000/api/admin/dept')
  departments.value = res.data
}

// ✅ โหลดกลุ่ม
const loadGroups = async () => {
  const res = await axios.get('http://localhost:7000/api/admin/group')
  groups.value = res.data
}

// ================== EDIT ==================
const openEdit = (user) => {
  editUser.value = { ...user }
  editDialog.value = true
}

const updateUser = async () => {
  await axios.put(
    `http://localhost:7000/api/admin/users/${editUser.value.id}`,
    editUser.value
  )
  editDialog.value = false
  loaddata()
}

// ================== DELETE ==================
const deleteUser = async (user) => {
  if (!confirm(`ลบ ${user.name} ใช่หรือไม่`)) return
  await axios.delete(
    `http://localhost:7000/api/admin/users/${user.id}`
  )
  loaddata()
}

// ================== MOUNT ==================
onMounted(() => {
  const token = localStorage.getItem('token')
  if (!token) router.replace('/')

  loaddata()
  loadDepartments()
  loadGroups()
})
</script>


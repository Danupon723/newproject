<template>
  <v-container fluid>
    <h3 class="text-h5 mb-6">ตารางแสดงผลข้อมูล</h3>

    <!-- การ์ดสรุปข้อมูล -->
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

        <template #item.index="{ index }">
          {{ index + 1 }}
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

    <!-- Popup แก้ไขผู้ใช้ -->
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
            prepend-inner-icon="mdi-email"
          />
          <v-text-field
            label="รหัสผ่าน"
            v-model="editUserData.password"
            type="password"
            variant="outlined"
            class="mb-3"
            prepend-inner-icon="mdi-lock"
            placeholder="เว้นว่างถ้าไม่เปลี่ยนรหัส"
          />
          <v-text-field
            label="ชื่อผู้ใช้"
            v-model="editUserData.name"
            variant="outlined"
            class="mb-3"
            prepend-inner-icon="mdi-account"
          />
          <v-select
            v-model="editUserData.department_id"
            :items="departments"
            item-title="name"
            item-value="id"
            label="แผนก"
            variant="outlined"
            class="mb-3"
          />
          <v-select
            v-model="editUserData.group_id"
            :items="groups"
            item-title="name"
            item-value="id"
            label="กลุ่ม"
            variant="outlined"
            class="mb-3"
          />
          <v-select
            v-model="editUserData.role_id"
            :items="roles"
            item-title="name"
            item-value="id"
            label="ตำแหน่ง"
            variant="outlined"
            class="mb-3"
          />

          <v-btn type="submit" color="primary" block class="mt-4">
            บันทึก
          </v-btn>
          <v-btn color="grey" block class="mt-2" @click="editDialog = false">
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

// Popup แก้ไข
const editDialog = ref(false)
const editUserData = ref({})

// Options จากฐานข้อมูล
const departments = ref([])
const groups = ref([])
const roles = ref([])

// ตรวจ token และโหลดข้อมูล
onMounted(() => {
  const token = localStorage.getItem('token')
  if (!token) router.replace('/')
  loadUsers()
  loadOptions()
})

// หัวตาราง
const headers = [
  { title: 'ลำดับ', key: 'index' },
  { title: 'อีเมล', key: 'email' },
  { title: 'ชื่อ', key: 'name' },
  { title: 'ตำเเหน่ง', key: 'role' },
  { title: 'แผนก', key: 'department' },
  { title: 'กลุ่ม', key: 'group' },
  { title: 'สถานะ', key: 'active' },
  { title: 'จัดการ', key: 'actions', sortable: false }
]

// โหลดผู้ใช้งาน
const loadUsers = async () => {
  loading.value = true
  try {
    const res = await axios.get('http://localhost:7000/api/admin/userlist')
    users.value = res.data.map(u => ({
      ...u,
      department: u.department_name,
      group: u.group_name,
      role: u.role_name,
      active: u.active === 1 ? 'ใช้งาน' : 'ปิดใช้งาน'
    }))
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

// โหลด options จากฐานข้อมูล
const loadOptions = async () => {
  try {
    const [deptRes, groupRes, roleRes] = await Promise.all([
      axios.get('http://localhost:7000/api/departments'),
      axios.get('http://localhost:7000/api/groups'),
      axios.get('http://localhost:7000/api/roles')
    ])
    departments.value = deptRes.data
    groups.value = groupRes.data
    roles.value = roleRes.data
  } catch (e) {
    console.error('โหลด options ไม่สำเร็จ', e)
  }
}

// เปิด popup + โหลดข้อมูลผู้ใช้
const openEditDialog = (user) => {
  editUserData.value = {
    id: user.id,
    email: user.email,
    password: '',
    name: user.name,
    department_id: user.department_id,
    group_id: user.group_id,
    role_id: user.role_id
  }
  editDialog.value = true
}

// อัพเดทผู้ใช้
const updateUser = async () => {
  try {
    await axios.put(`http://localhost:7000/api/admin/users/${editUserData.value.id}`, editUserData.value)
    alert('บันทึกสำเร็จ')
    editDialog.value = false
    loadUsers()
  } catch (e) {
    console.error(e)
    alert('บันทึกไม่สำเร็จ')
  }
}

// ลบผู้ใช้
const deleteUser = (user) => {
  if (!confirm(`คุณต้องการลบ ${user.name} ใช่หรือไม่?`)) return
  users.value = users.value.filter(u => u !== user)
}
</script>

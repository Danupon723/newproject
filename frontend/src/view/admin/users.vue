<template>
  <v-container>

    <!-- ✅ ตารางผู้ใช้ -->
    <v-data-table
      :headers="headers"
      :items="users"
      :loading="loading"
      item-key="id"
      class="elevation-1"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>แสดงรายชื่อผู้ใช้งาน</v-toolbar-title>
          <v-spacer />
          <v-btn color="primary" @click="addDialog = true">
            เพิ่มผู้ใช้งานบัญชี
          </v-btn>
        </v-toolbar>
      </template>

      <template #item.index="{ index }">
        {{ index + 1 }}
      </template>

      <template #item.active="{ item }">
        <v-chip
          :color="item.active === 'ใช้งาน' ? 'green' : 'red'"
          size="small"
        >
          {{ item.active }}
        </v-chip>
      </template>
    </v-data-table>

    <!-- ✅ POPUP (เอาฟอร์มคุณมาใส่ตรงนี้) -->
    <v-dialog v-model="addDialog" max-width="500">
      <v-card class="pa-6">

        <v-card-title class="text-h5 text-center mb-4">
          📝 เพิ่มข้อมูลผู้ใช้
        </v-card-title>

        <v-form>
          <v-text-field
            label="อีเมล"
            v-model="email"
            type="email"
            variant="outlined"
            class="mb-3"
            prepend-inner-icon="mdi-email"
          />

          <v-text-field
            label="รหัสผ่าน"
            v-model="password"
            type="password"
            variant="outlined"
            class="mb-3"
            prepend-inner-icon="mdi-lock"
          />

          <v-text-field
            label="ชื่อผู้ใช้"
            v-model="name"
            variant="outlined"
            class="mb-3"
            prepend-inner-icon="mdi-account"
          />

          <v-select
            v-model="department_id"
            :items="department"
            item-title="name"
            item-value="id"
            label="แผนก"
            variant="outlined"
            class="mb-3"
          />

          <v-select
            v-model="group_id"
            :items="group"
            item-title="name"
            item-value="id"
            label="กลุ่ม"
            variant="outlined"
            class="mb-3"
          />

          <v-select
            v-model="roles"
            :items="role"
            label="ตำแหน่ง"
            variant="outlined"
            class="mb-4"
          />

          <v-card-actions>
            <v-spacer />
            <v-btn text @click="addDialog = false">ยกเลิก</v-btn>
            <v-btn color="primary" @click="handleRegister">
              เพิ่มผู้ใช้
            </v-btn>
          </v-card-actions>

        </v-form>
      </v-card>
    </v-dialog>

  </v-container>
</template>
<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const users = ref([])
const loading = ref(false)
const addDialog = ref(false)

// ✅ ฟอร์ม (ของเดิม)
const email = ref("");
const password = ref("");
const name = ref("");
const department_id = ref("");
const group_id = ref("");
const roles = ref("");

// ✅ dropdown data
const department = ref([])
const group = ref([])
const role = ['admin','evaluatee','evaluator']

// ✅ หัวตาราง
const headers = [
  { title: 'ลำดับ', key: 'index' },
  { title: 'อีเมล', key: 'email' },
  { title: 'ชื่อ', key: 'name' },
  { title: 'ตำแหน่ง', key: 'role' },
  { title: 'แผนก', key: 'daprt_name' },
  { title: 'กลุ่ม', key: 'group_name' },
  { title: 'สถานะ', key: 'active' }
]

// ✅ โหลด USERS
const fetchUsers = async () => {
  loading.value = true
  const res = await axios.get('http://localhost:7000/api/admin/userlist')
  users.value = res.data.map(u => ({
    ...u,
    active: u.active === 1 ? 'ใช้งาน' : 'ปิดใช้งาน'
  }))
  loading.value = false
}

// ✅ โหลด แผนก / กลุ่ม
const loaddata = async () => {
  const dept = await axios.get('http://localhost:7000/api/admin/dept')
  department.value = dept.data

  const grp = await axios.get('http://localhost:7000/api/admin/grop')
  group.value = grp.data
}

// ✅ submit เดิม (เพิ่ม close popup + refresh)
const handleRegister = async () => {
  const pay = {
    name: name.value,
    email: email.value,
    password: password.value,
    department_id: department_id.value,
    group_id: group_id.value,
    role: roles.value
  }

  try {
    await axios.post('http://localhost:7000/api/auth/register', pay)

    addDialog.value = false
    name.value = email.value = password.value = ""
    department_id.value = group_id.value = roles.value = ""

    fetchUsers()
  } catch (e) {
    console.log(e)
  }
}

onMounted(() => {
  fetchUsers()
  loaddata()
})
</script>

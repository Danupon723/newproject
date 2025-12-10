<template>
  <v-container fluid>
    <!-- ✅ สรุปข้อมูลด้านบน -->
    <h3 class="text-h5 mb-6">Dashboard</h3>
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
          <h2 class="text-success">{{ evaluatorsCount }} คน</h2>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-4" elevation="3">
          <h3>แบบประเมิน</h3>
          <h2 class="text-warning">{{ assessmentsCount }} รายการ</h2>
        </v-card>
      </v-col>
    </v-row>

    <!-- ✅ ตารางผู้ใช้งาน -->
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
            <v-spacer />
            <v-btn color="primary" @click="addDialog = true">
              เพิ่มผู้ใช้งาน
            </v-btn>
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

    <!-- ✅ Popup เพิ่มผู้ใช้ -->
    <v-dialog v-model="addDialog" max-width="500px">
      <v-card class="pa-6">
        <h2 class="text-h5 mb-4">เพิ่มผู้ใช้งาน</h2>
        <v-form>
          <v-text-field v-model="newUser.email" label="อีเมล" />
          <v-text-field v-model="newUser.name" label="ชื่อ" />
          <v-text-field
            v-model="newUser.password"
            label="รหัสผ่าน"
            type="password"
          />
          <v-select
            v-model="newUser.role"
            :items="roles"
            item-title="name"
            item-value="id"
            label="ตำแหน่ง"
          />
          <v-select
            v-model="newUser.department_id"
            :items="departments"
            item-title="name"
            item-value="id"
            label="แผนก"
          />
          <v-select
            v-model="newUser.group_id"
            :items="groups"
            item-title="name"
            item-value="id"
            label="กลุ่ม"
          />
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="addDialog = false">ยกเลิก</v-btn>
            <v-btn color="primary" @click="saveUser">บันทึก</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- ✅ Popup แก้ไขผู้ใช้ -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card class="pa-6">
        <h2 class="text-h5 mb-4">แก้ไขข้อมูลผู้ใช้</h2>
        <v-form @submit.prevent="updateUser">
          <v-text-field v-model="editUserData.email" label="อีเมล" />
          <v-text-field v-model="editUserData.name" label="ชื่อ" />
          <v-select
            v-model="editUserData.role"
            :items="role"
            item-title="name"
            item-value="id"
            label="ตำแหน่ง"
          />
          <v-select
            v-model="editUserData.department_id"
            :items="departments"
            item-title="name"
            item-value="id"
            label="แผนก"
          />
          <v-select
            v-model="editUserData.group_id"
            :items="groups"
            item-title="name"
            item-value="id"
            label="กลุ่ม"
          />
          <v-card-actions>
            <v-spacer />
            <v-btn color="grey" @click="editDialog = false">ยกเลิก</v-btn>
            <v-btn color="primary" @click="updateUser">บันทึก</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const users = ref([])
const loading = ref(false)
const departments = ref([])
const groups = ref([])
const roles = ref([])
const role = ['admin', 'evaluatee', 'evaluator']

const addDialog = ref(false)
const editDialog = ref(false)
const newUser = ref({
  email: '',
  name: '',
  password: '',
  role: null,
  department_id: null,
  group_id: null
})
const editUserData = ref({})

const evaluatorsCount = ref(0)
const assessmentsCount = ref(0)

const headers = [
  { title: 'ลำดับ', key: 'index' },
  { title: 'อีเมล', key: 'email' },
  { title: 'ชื่อ', key: 'name' },
  { title: 'ตำแหน่ง', key: 'role' },
  { title: 'แผนก', key: 'daprt_name' },
  { title: 'กลุ่ม', key: 'group_name' },
  { title: 'สถานะ', key: 'active' },
  { title: 'จัดการ', key: 'actions', sortable: false }
]

// โหลดข้อมูลผู้ใช้
const loadUsers = async () => {
  loading.value = true
  try {
    const res = await axios.get('http://localhost:7000/api/admin/userlist')
    users.value = res.data.map(u => ({
      ...u,
      active: u.active === 1 ? 'ใช้งาน' : 'ปิดใช้งาน'
    }))
    evaluatorsCount.value = users.value.filter(u => u.role === 'evaluator').length
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

// โหลดแผนกและกลุ่ม
const loadMasterData = async () => {
  try {
    const dept = await axios.get('http://localhost:7000/api/admin/dept')
    departments.value = dept.data
    const grp = await axios.get('http://localhost:7000/api/admin/grop')
    groups.value = grp.data
  } catch (e) {
    console.error(e)
  }
}

// เปิด Popup แก้ไข
const openEditDialog = user => {
  editUserData.value = { ...user }
  editDialog.value = true
}

// เพิ่มผู้ใช้ใหม่
const saveUser = async () => {
  try {
    await axios.post('http://localhost:7000/api/auth/register', newUser.value)
    addDialog.value = false
    newUser.value = { email: '', name: '', password: '', role: null, department_id: null, group_id: null }
    loadUsers()
  } catch (e) {
    console.error(e)
    alert('เพิ่มผู้ใช้ไม่สำเร็จ')
  }
}

// อัปเดตผู้ใช้
const updateUser = async () => {
  try {
    await axios.put(`http://localhost:7000/api/admin/users/${editUserData.value.id}`, editUserData.value)
    editDialog.value = false
    loadUsers()
  } catch (e) {
    console.error(e)
    alert('บันทึกไม่สำเร็จ')
  }
}

// ลบผู้ใช้
const deleteUser = user => {
  if (!confirm(`คุณต้องการลบ ${user.name} ใช่หรือไม่?`)) return
  users.value = users.value.filter(u => u.id !== user.id)
}

onMounted(() => {
  loadUsers()
  loadMasterData()
})
</script>

<style scoped>
.v-data-table {
  margin-top: 20px;
}
</style>

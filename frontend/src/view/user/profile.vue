<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="mx-auto pa-4" elevation="3">

          <!-- profile -->
          <div class="text-center">
            <v-avatar size="100" class="elevation-2">
              <v-img :src="user.avatarUrl || defaultAvatar" />
            </v-avatar>

            <div class="text-h6 mt-3">{{ user.name }}</div>
            <div class="text-subtitle-1 text-medium-emphasis">{{ user.role }}</div>
          </div>

          <v-divider class="my-4" />

          <v-list density="compact">
            <v-list-item prepend-icon="mdi-email" :title="user.email" />
            <v-list-item :title="user.department || '-'" />
            <v-list-item :title="user.group || '-'" />
          </v-list>

          <v-divider class="my-4" />

          <v-card-actions>
            <v-btn block color="primary" variant="flat"  @click="dialog = true">
              แก้ไขข้อมูลส่วนตัว
            </v-btn>
          </v-card-actions>

        </v-card>
      </v-col>
    </v-row>

    <!-- ✅ Dialog แก้ไขข้อมูล -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card class="pa-4">

        <v-card-title class="text-center text-primary ">
          แก้ไขข้อมูลส่วนตัว
        </v-card-title>

        <v-divider />

        <v-card-text>
          <v-avatar size="100" class="mx-auto mb-4">
            <v-img :src="preview || defaultAvatar" />
          </v-avatar>

          <v-file-input
            label="เลือกรูปโปรไฟล์"
            accept="image/*"
            @change="onFileChange"
            variant="outlined"
          />

          <v-text-field
            v-model="editUser.name"
            label="ชื่อ"
            variant="outlined"
            prepend-inner-icon="mdi-account"
          />
        </v-card-text>

        <v-card-actions>
          <v-btn block color="primary" @click="saveProfile">
            บันทึก
          </v-btn><br>
        </v-card-actions>

      </v-card>
    </v-dialog>
  </v-container>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const dialog = ref(false)

const defaultAvatar = '/images/default-avatar.png'
const preview = ref(null)
const file = ref(null)

const user = ref({
  name: '',
  role: '',
  email: '',
  department: '',
  group: '',
  avatarUrl: null
})

// ✅ ใช้คนละ state กันชัดเจน
const editUser = ref({ name: '' })

// โหลดข้อมูลผู้ใช้
const loadUser = async () => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: 'Bearer ' + token }

  const res = await axios.get(
    'http://localhost:7000/api/evaluatee/profile',
    { headers }
  )

  const data = res.data.item

  user.value = {
    name: data.name,
    role: data.role,
    email: data.email,
    department: data.deprmt_name,
    group: data.group_name,
    avatarUrl: data.avatarUrl || null
  }

  // ✅ init ค่าให้ dialog
  editUser.value.name = data.name
}

// preview รูป
const onFileChange = (e) => {
  file.value = e.target.files[0]
  preview.value = URL.createObjectURL(file.value)
}

// บันทึกโปรไฟล์
const saveProfile = async () => {
  try {
    const form = new FormData()
    form.append('name', editUser.value.name)

    if (file.value) {
      form.append('avatar', file.value)
    }

    await axios.post(
      'http://localhost:7000/api/profile',
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )

    dialog.value = false
    preview.value = null
    file.value = null
    await loadUser()
  } catch (err) {
    console.error(err)
    alert('บันทึกไม่สำเร็จ')
  }
}

onMounted(loadUser)
</script>

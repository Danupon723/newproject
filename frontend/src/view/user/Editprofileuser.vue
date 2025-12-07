<template>
  <v-container class="mt-8" fluid>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="5">
        <v-card elevation="6" rounded="xl">
          <v-card-title class="text-center text-primary">
            แก้ไขข้อมูลส่วนตัว
          </v-card-title>

          <v-divider />

          <v-card-text>
            <!-- รูปโปรไฟล์ -->
            <v-avatar size="100" class="mx-auto mb-4">
              <v-img :src="preview || defaultImg" />
            </v-avatar>

            <v-file-input
              label="เลือกรูปโปรไฟล์"
              accept="image/*"
              prepend-icon="mdi-camera"
              @change="onFileChange"
              variant="outlined"
            />

            <v-text-field
              v-model="u.name"
              label="เปลี่ยนชื่อ"
              variant="outlined"
              prepend-inner-icon="mdi-account"
            />
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="primary"
              block
              size="large"
              @click="save"
            >
              บันทึกข้อมูล
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter() 
const defaultImg = '/default-avatar.png'   // รูป default
const preview = ref(null)
const file = ref(null)

const u = ref({ name: '', avatar: '' })
const URL = 'http://localhost:7000/api/profile'

onMounted(async () => {
  const res = await axios.get(URL)
  u.value = res.data
  preview.value = u.value.avatar ? u.value.avatar : null
})

const onFileChange = (e) => {
  file.value = e.target.files[0]
  preview.value = URL.createObjectURL(file.value)
}

const save = async () => {
  const form = new FormData()
  form.append('name', u.value.name)
  if (file.value) form.append('avatar', file.value)

  await axios.post(URL, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
    router.push('/user/profile')
}
</script>

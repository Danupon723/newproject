<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh;">
    <v-card class="pa-6" style="max-width: 600px; width: 100%;">
      <h2 class="text-h6 mb-4 text-center">เพิ่มหัวข้อการประเมิน</h2>

      <!-- Title -->
      <v-text-field
        v-model="form.title"
        label="หัวข้อการประเมิน"
        variant="outlined"
      />

      <!-- Description -->
      <v-text-field
        v-model="form.description"
        label="คำอธิบาย"
        variant="outlined"
        class="mt-4"
      />

      <!-- Weight -->
      <v-text-field
        v-model="form.weight"
        label="คะแนนเต็ม"
        variant="outlined"
        type="number"
        class="mt-4"
      />

      <v-btn color="primary" class="mt-4" block @click="submitForm">
        เพิ่มหัวข้อ
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'


const router = useRoute()


const form = ref({
  title: '',
  description: '',
  weight: ''
})

const submitForm = async () => {
  if (!form.value.title || !form.value.description || !form.value.weight) {
    alert('กรอกข้อมูลให้ครบทุกช่อง')
    return
  }

  try {
    const payload = {
      title_th: form.value.title,
      description: form.value.description,
      weight: form.value.weight
    }
        console.log(payload)
    const res = await axios.post('http://localhost:7000/api/admin/createtopic', payload)
    console.log('สร้างหัวข้อสำเร็จ', res.data)
    
    // รีเซ็ตฟอร์ม
    form.value.title = ''
    form.value.description = ''
    form.value.weight = ''
    
    alert('เพิ่มหัวข้อเรียบร้อยแล้ว')
    router.push()
  } catch (err) {
    console.error('เกิดข้อผิดพลาด', err)
    alert('เพิ่มหัวข้อไม่สำเร็จ')
  }
}
</script>

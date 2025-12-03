<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh;">
    <!-- ฟอร์มเดียว -->
    <v-card class="pa-6" style="max-width: 600px; width: 100%;">
      <h2 class="text-h6 mb-4 text-center">เพิ่มรายการ</h2>

      <!-- Dropdown 1 -->
      <v-select
        v-model="form.option1"
        :items="options1"
        label="เลือกผู้ใช้"
        variant="outlined"
      />

      <!-- Dropdown 2 : แผนก -->
      <v-select
        v-model="form.option2"
        :items="options2"
        item-title="name"
        item-value="id"
        label="เลือกแผนก"
        variant="outlined"
        class="mt-4"
      />

      <!-- Dropdown 3 -->
      <v-select
        v-model="form.option3"
        :items="options3"
        label="เลือกผู้ที่จะประเมิน"
        variant="outlined"
        class="mt-4"
      />

      <!-- คำอธิบาย -->
      <v-text-field
        v-model="form.description"
        label="คำอธิบาย"
        variant="outlined"
        class="mt-4"
      />

      <v-btn color="primary" class="mt-4" block @click="submitForm">
        เพิ่ม
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Dropdown options
const options1 = ref(['ผู้ใช้ A', 'ผู้ใช้ B', 'ผู้ใช้ C'])
const options2 = ref([]) // แผนก จะดึงจาก API
const options3 = ref(['ผู้ประเมิน 1', 'ผู้ประเมิน 2', 'ผู้ประเมิน 3'])

// ฟอร์ม
const form = ref({
  option1: '',
  option2: '',
  option3: '',
  description: ''
})

// โหลดแผนกจาก API
async function loadDepartments() {
  try {
    const res = await axios.get('http://localhost:7000/api/auth/dept')
    options2.value = res.data
  } catch (err) {
    console.error('โหลดแผนกไม่สำเร็จ', err)
  }
}

onMounted(() => {
  loadDepartments()
})

// ฟังก์ชัน submit form
const submitForm = () => {
  if (!form.value.option1 || !form.value.option2 || !form.value.option3 || !form.value.description) {
    alert('กรอกข้อมูลให้ครบทุกช่อง')
    return
  }

  console.log('ข้อมูลที่ส่ง:', { ...form.value })

  // ล้างฟอร์ม
  form.value = { option1: '', option2: '', option3: '', description: '' }
}
</script>

<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh;">
    <v-card class="pa-6" style="max-width: 600px; width: 100%;">
      <h2 class="text-h6 mb-4 text-center">เพิ่มหัวข้อประเมินย่อย</h2>

      <!-- Dropdown เลือก Topic -->
      <v-select
        v-model="form.topicId"
        :items="topics"
        item-title="title_th"
        item-value="id"
        label="เลือกหัวข้อหลัก"
        variant="outlined"
      />

      <!-- Title -->
      <v-text-field
        v-model="form.title"
        label="ชื่อหัวข้อประเมินย่อย"
        variant="outlined"
        class="mt-4"
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
        type="number"
        variant="outlined"
        class="mt-4"
      />

      <!-- Score 1-4 -->
      <v-select
        v-model="form.score"
        :items="['yes_no','file_url','score_1_4']"
        label="คะแนน (1-4)"
        variant="outlined"
        class="mt-4"
      />

      

      <v-btn color="primary" class="mt-4" block @click="submitForm">
        เพิ่มหัวข้อย่อย
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const router = useRoute()

// ฟอร์ม
const form = ref({
  topicId: '',
  title: '',
  description: '',
  weight: '',
  score: '',
  file_url: '',
  yes_no: ''
})

// Dropdown Topic
const topics = ref([])

// โหลดหัวข้อหลักจาก API
async function loadTopics() {
  try {
    const res = await axios.get('http://localhost:7000/api/admin/topiclist')
    topics.value = res.data
  } catch (err) {
    console.error('โหลดหัวข้อไม่สำเร็จ', err)
  }
}

onMounted(loadTopics)

// Submit form
const submitForm = async () => {
  if (!form.value.topicId || !form.value.title || !form.value.description || !form.value.weight
      || !form.value.score ) {
    alert('กรอกข้อมูลให้ครบทุกช่อง')
    return
  }

  const payload = {
    topicId: form.value.topicId,
    title: form.value.title,
    description: form.value.description,
    weight: form.value.weight,
    score: form.value.score,
  }

  try {
    console.log(payload)
    const res = await axios.post('http://localhost:7000/api/admin/addindicator', payload)
    console.log('สร้างหัวข้อย่อยสำเร็จ', res.data)
    
    // รีเซ็ตฟอร์ม
    form.value = {
      topicId: '',
      title: '',
      description: '',
      weight: '',
      score: '',
      file_url: '',
      yes_no: ''
    }

    alert('เพิ่มหัวข้อย่อยเรียบร้อย')
    router.push('/admin/subtopic')
  } catch (err) {
    console.error('เกิดข้อผิดพลาด', err)
    alert('เพิ่มหัวข้อย่อยไม่สำเร็จ')
    router.push('/admin/subtopic')
  }
}
</script>

<template>
  <v-container>
    <v-card class="pa-4">
      <h2>ฟอร์มประเมินผู้ถูกประเมิน</h2>

      <div v-for="sub in subtopics" :key="sub.id" class="mb-6">
        <h3>{{ sub.name }}</h3>
        <p>{{ sub.description }}</p>

        <!-- Score 1-4 -->
        <v-select
          v-if="sub.type === 'score_1_4'"
          :items="[1,2,3,4]"
          label="คะแนน 1-4"
          v-model="answers[sub.id].score"
        />

        <!-- Yes / No -->
        <v-select
          v-if="sub.type === 'yes_no'"
          :items="['Yes','No']"
          label="Yes / No"
          v-model="answers[sub.id].yes_no"
        />

        <!-- File upload -->
        <v-file-input
          v-if="sub.type === 'file_url'"
          label="อัปโหลดไฟล์"
          v-model="answers[sub.id].file_url"
        />
      </div>

      <v-btn color="primary" @click="submitEvaluation">
        บันทึกการประเมิน
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const subtopics = ref([])
const answers = ref({})

const fetchSubtopics = async () => {
  try {
    const res = await axios.get('http://localhost:7000/api/evaluatee/subtopics')
    subtopics.value = res.data

    // สร้าง object answers เริ่มต้นตาม type
    res.data.forEach(sub => {
      answers.value[sub.id] = {
        score: sub.type === 'score_1_4' ? null : undefined,
        yes_no: sub.type === 'yes_no' ? null : undefined,
        file_url: sub.type === 'file_url' ? null : undefined
      }
    })
  } catch (err) {
    console.error('โหลดหัวข้อย่อยไม่สำเร็จ', err)
  }
}

const submitEvaluation = async () => {
  try {
    console.log('ข้อมูลที่จะส่ง:', answers.value)

    // สร้าง FormData ถ้ามีไฟล์
    const formData = new FormData()
    Object.entries(answers.value).forEach(([subId, ans]) => {
      if (ans.score !== undefined) formData.append(`answers[${subId}][score]`, ans.score)
      if (ans.yes_no !== undefined) formData.append(`answers[${subId}][yes_no]`, ans.yes_no)
      if (ans.file_url) formData.append(`answers[${subId}][file_url]`, ans.file_url)
    })

    await axios.post('http://localhost:7000/api/evaluatee/submit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    alert('บันทึกเรียบร้อย!')
  } catch (err) {
    console.error('บันทึกไม่สำเร็จ', err)
  }
}

onMounted(fetchSubtopics)
</script>

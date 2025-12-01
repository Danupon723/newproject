<template>
  <v-container>
    <!-- ตารางแสดงหัวข้อการประเมิน -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="topics"
        :loading="loading"
      >
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title>รายการหัวข้อการประเมินย่อย</v-toolbar-title>
            <router-link to="addtopic"><v-btn color="primary" >เพิ่มหัวข้อประเมินย่อย</v-btn></router-link>
          </v-toolbar>
        </template>

        <template #item.actions="{ item }">
          <v-btn icon color="warning" @click="editTopic(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>

          <v-btn icon color="red" @click="deleteTopic(item.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const topics = ref([])
const loading = ref(false)

const form = ref({
  id: null,
  title: '',
  score: ''
})

const headers = [
  { text: 'ลำดับ', value: 'id' },
  { text: 'ชื่อหัวข้อการประเมิน', value: 'title' },
  { text: 'คะแนนเต็ม', value: 'score' },
  { text: 'จัดการ', value: 'actions', sortable: false }
]

// ✅ ดึงข้อมูลหัวข้อ
const fetchTopics = async () => {
  loading.value = true
  try {
    const res = await axios.get('http://localhost:7000/api/topics')
    topics.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// ✅ เพิ่ม / แก้ไขหัวข้อ
const submitTopic = async () => {
  try {
    if (form.value.id) {
      // แก้ไข
      await axios.put(`http://localhost:7000/api/topics/${form.value.id}`, form.value)
    } else {
      // เพิ่มใหม่
      await axios.post('http://localhost:7000/api/topics', form.value)
    }

    resetForm()
    fetchTopics()
  } catch (err) {
    console.error(err)
  }
}

// ✅ แก้ไข
const editTopic = (item) => {
  form.value = { ...item }
}

// ✅ ลบ
const deleteTopic = async (id) => {
  if (!confirm('ยืนยันการลบหัวข้อนี้?')) return
  try {
    await axios.delete(`http://localhost:7000/api/topics/${id}`)
    fetchTopics()
  } catch (err) {
    console.error(err)
  }
}

// ✅ รีเซ็ตฟอร์ม
const resetForm = () => {
  form.value = {
    id: null,
    title: '',
    score: ''
  }
}

onMounted(fetchTopics)
</script>

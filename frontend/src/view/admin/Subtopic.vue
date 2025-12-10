<template>
  <v-container>
    <!-- ตารางหัวข้อ -->
    <v-data-table
      :headers="headers"
      :items="topics"
      :loading="loading"
      item-key="id"
      class="elevation-1"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>รายการหัวข้อการประเมิน</v-toolbar-title>
          <v-spacer />
          <v-btn color="primary" @click="dialogAdd = true">
            เพิ่มหัวข้อการประเมิน
          </v-btn>
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

    <!-- Popup เพิ่มหัวข้อ -->
    <v-dialog v-model="dialogAdd" max-width="600">
      <v-card class="pa-6">
        <h2 class="text-h5 mb-4">เพิ่มหัวข้อการประเมิน</h2>

        <v-form @submit.prevent="saveTopic">
          <v-text-field
            v-model="form.title_th"
            label="ชื่อหัวข้อ"
            required
          />
          <v-text-field
            v-model="form.description"
            label="คำอธิบาย"
          />
          <v-text-field
            v-model="form.weight"
            type="number"
            label="คะเเนน"
            required
          />

          <v-card-actions class="mt-4">
            <v-spacer />
            <v-btn text @click="dialogAdd = false">ยกเลิก</v-btn>
            <v-btn color="primary" @click="saveTopic">เพิ่มหัวข้อ</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const topics = ref([])
const loading = ref(false)
const dialogAdd = ref(false)

const form = ref({
  title_th: '',
  description: '',
  weight: ''
})

const headers = [
  { title: 'ลำดับ', key: 'id' },
  { title: 'หัวข้อ', key: 'title_th' },
  { title: 'คำอธิบาย', key: 'description' },
  { title: 'คะเเนน', key: 'weight' },
  { title: 'จัดการ', key: 'actions', sortable: false }
]

// ดึงข้อมูลหัวข้อ
const fetchTopics = async () => {
  loading.value = true
  try {
    const res = await axios.get('http://localhost:7000/api/admin/topiclist')
    topics.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// เพิ่มหัวข้อ
const saveTopic = async () => {
  try {
    await axios.post('http://localhost:7000/api/admin/createTopic', form.value)
    alert('เพิ่มหัวข้อสำเร็จ ✅')
    dialogAdd.value = false
    form.value = { title_th:'', description:'', weight:'' }
    fetchTopics()
  } catch (err) {
    console.error(err)
    alert('เพิ่มหัวข้อไม่สำเร็จ ❌')
  }
}

// แก้ไขหัวข้อ
const editTopic = (item) => {
  form.value = { ...item }
  dialogAdd.value = true
}

// ลบหัวข้อ
const deleteTopic = async (id) => {
  if (!confirm('ยืนยันการลบหัวข้อนี้?')) return
  try {
    await axios.delete(`http://localhost:7000/api/admin/topic/${id}`)
    fetchTopics()
  } catch (err) {
    console.error(err)
  }
}

onMounted(fetchTopics)
</script>

<style scoped>
.v-data-table {
  margin-top: 20px;
}
</style>

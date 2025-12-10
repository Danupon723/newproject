<template>
  <v-container>
    <!-- ตารางแสดงหัวข้อการประเมิน -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="topics"
        :loading="loading"
        item-key="id"
      >
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title>รายการหัวข้อการประเมินหลัก</v-toolbar-title>
            <v-btn color="primary" @click="dialogAdd = true">เพิ่มหัวข้อประเมินหลัก</v-btn>
          </v-toolbar>
        </template>

        <template #item.active="{ item }">
          <v-chip
            :color="item.active === 1 ? 'green' : 'red'"
            text-color="white"
            size="small"
          >
            {{ item.active === 1 ? 'ใช้งาน' : 'ปิดใช้งาน' }}
          </v-chip>
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

    <!-- Popup เพิ่มหัวข้อ -->
    <v-dialog v-model="dialogAdd" max-width="600">
      <v-card class="pa-6">
        <h2 class="text-h5 mb-4">เพิ่มหัวข้อการประเมิน</h2>

        <v-form @submit.prevent="saveTopic">
          <v-text-field
            v-model="form.name"
            label="ชื่อหัวข้อการประเมิน"
            required
          />

          <v-text-field
            v-model="form.buddhist_year"
            type="number"
            label="ปีการประเมิน"
            required
          />

          <v-text-field
            v-model="form.start_date"
            type="date"
            label="กำหนดเวลาเปิด"
            required
          />

          <v-text-field
            v-model="form.end_date"
            type="date"
            label="กำหนดเวลาปิด"
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
  name: '',
  buddhist_year: '',
  start_date: '',
  end_date: ''
})

const headers = [
  { title: 'ลำดับ', key: 'id' },
  { title: 'หัวข้อการประเมิน', key: 'name' },
  { title: 'ปีที่เริ่ม', key: 'buddhist_year' },
  { title: 'วันที่เริ่ม', key: 'start_date' },
  { title: 'วันที่จบ', key: 'end_date' },
  { title: 'สถานะ', key: 'active' },
  { title: 'จัดการ', key: 'actions', sortable: false }
]

// ดึงข้อมูลหัวข้อ
const fetchTopics = async () => {
  loading.value = true
  try {
    const res = await axios.get('http://localhost:7000/api/admin/periodslist')
    topics.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// เพิ่ม / แก้ไขหัวข้อ
const saveTopic = async () => {
  try {
    await axios.post('http://localhost:7000/api/admin/createperiod', form.value)
    alert('เพิ่มหัวข้อสำเร็จ ✅')
    dialogAdd.value = false
    form.value = { name:'', buddhist_year:'', start_date:'', end_date:'' }
    fetchTopics()
  } catch (err) {
    console.error(err)
    alert('เพิ่มหัวข้อไม่สำเร็จ ❌')
  }
}

// แก้ไข
const editTopic = (item) => {
  form.value = { ...item }
  dialogAdd.value = true
}

// ลบ
const deleteTopic = async (id) => {
  if (!confirm('ยืนยันการลบหัวข้อนี้?')) return
  try {
    await axios.delete(`http://localhost:7000/api/topics/${id}`)
    fetchTopics()
  } catch (err) {
    console.error(err)
  }
}

onMounted(fetchTopics)
</script>

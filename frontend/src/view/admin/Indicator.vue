<template>
  <v-container>
    <!-- ตารางหัวข้อย่อย -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="subtopics"
        :loading="loading"
        item-key="id"
        class="elevation-1"
      >
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title>รายการหัวข้อการประเมินย่อย</v-toolbar-title>
            <v-spacer />
            <v-btn color="primary" @click="dialogAdd = true">
              เพิ่มหัวข้อประเมินย่อย
            </v-btn>
          </v-toolbar>
        </template>

        <template #item.actions="{ item }">
          <v-btn icon color="warning" @click="editSubtopic(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>

          <v-btn icon color="red" @click="deleteSubtopic(item.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Popup เพิ่ม/แก้ไข -->
    <v-dialog v-model="dialogAdd" max-width="600">
      <v-card class="pa-6">
        <h2 class="text-h5 mb-4">{{ form.id ? 'แก้ไขหัวข้อย่อย' : 'เพิ่มหัวข้อย่อย' }}</h2>

        <v-form @submit.prevent="saveSubtopic">
          <v-select
            v-model="form.topic_id"
            :items="topicsList"
            item-title="title_th"
            item-value="id"
            label="เลือกหัวข้อหลัก"
            required
          />
          <v-text-field
            v-model="form.name"
            label="ชื่อหัวข้อย่อย"
            required
          />
          <v-text-field
            v-model="form.description"
            label="คำอธิบาย"
          />
          <v-text-field
            v-model="form.weight"
            type="number"
            label="คะแนนเต็ม"
            required
          />

          <v-card-actions class="mt-4">
            <v-spacer />
            <v-btn text @click="dialogAdd = false">ยกเลิก</v-btn>
            <v-btn color="primary" @click="saveSubtopic">
              {{ form.id ? 'บันทึก' : 'เพิ่ม' }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const subtopics = ref([])
const topicsList = ref([]) // หัวข้อหลักสำหรับ select
const loading = ref(false)
const dialogAdd = ref(false)

const form = ref({
  id: null,
  topic_id: null,
  name: '',
  description: '',
  weight: ''
})

const headers = [
  { text: 'ลำดับ', key: 'id' },
  { text: 'หัวข้อหลัก', key: 'topic_title' }, // แสดงชื่อหัวข้อหลัก
  { text: 'ชื่อหัวข้อย่อย', key: 'name' },
  { text: 'คำอธิบาย', key: 'description' },
  { text: 'คะแนนเต็ม', key: 'weight' },
  { text: 'จัดการ', key: 'actions', sortable: false }
]

// ดึงข้อมูลหัวข้อย่อย
const fetchSubtopics = async () => {
  loading.value = true
  try {
    const res = await axios.get('http://localhost:7000/api/admin/indicatorslist')
    subtopics.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// ดึงหัวข้อหลักสำหรับ select
const fetchTopicsList = async () => {
  try {
    const res = await axios.get('http://localhost:7000/api/admin/topiclist')
    topicsList.value = res.data
  } catch (err) {
    console.error(err)
  }
}

// เพิ่ม/แก้ไขหัวข้อย่อย
const saveSubtopic = async () => {
  try {
    if (form.value.id) {
      await axios.put(`http://localhost:7000/api/admin/indicators/${form.value.id}`, form.value)
      alert('แก้ไขสำเร็จ')
    } else {
      await axios.post('http://localhost:7000/api/admin/createindicator', form.value)
      alert('เพิ่มหัวข้อสำเร็จ')
    }
    dialogAdd.value = false
    form.value = { id:null, topic_id:null, name:'', description:'', weight:'' }
    fetchSubtopics()
  } catch (err) {
    console.error(err)
    alert('เกิดข้อผิดพลาด')
  }
}

// แก้ไขหัวข้อย่อย
const editSubtopic = (item) => {
  form.value = { ...item }
  dialogAdd.value = true
}

// ลบหัวข้อย่อย
const deleteSubtopic = async (id) => {
  if (!confirm('ยืนยันการลบหัวข้อย่อย?')) return
  try {
    await axios.delete(`http://localhost:7000/api/admin/indicators/${id}`)
    fetchSubtopics()
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  fetchSubtopics()
  fetchTopicsList()
})
</script>

<style scoped>
.v-data-table {
  margin-top: 20px;
}
</style>

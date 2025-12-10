<template>
  <v-container>
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
            <router-link to="addmaintopic">
              <v-btn color="primary">เพิ่มหัวข้อประเมินหลัก</v-btn>
            </router-link>
          </v-toolbar>
        </template>

        <template #item.actions="{ item }">
          <v-btn icon color="warning" @click="editTopic(item.raw)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon color="red" @click="deleteTopic(item.raw.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- ✅ POPUP -->
    <v-dialog v-model="dialogEdit" max-width="600">
      <v-card>
        <v-card-title>แก้ไขหัวข้อการประเมิน</v-card-title>

        <v-card-text>
          <v-text-field label="หัวข้อการประเมิน" v-model="form.name" />
          <v-text-field label="ปีที่เริ่ม" type="number" v-model="form.buddhist_year" />
          <v-text-field label="วันที่เริ่ม" type="date" v-model="form.start_date" />
          <v-text-field label="วันที่จบ" type="date" v-model="form.end_date" />
          <v-select
            label="สถานะ"
            :items="[
              { title: 'เปิดใช้งาน', value: 1 },
              { title: 'ปิดใช้งาน', value: 0 }
            ]"
            v-model="form.active"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialogEdit = false">ยกเลิก</v-btn>
          <v-btn color="primary" @click="submitTopic">บันทึก</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const topics = ref([])
const loading = ref(false)
const dialogEdit = ref(false) // ✅ ต้องมี

const form = ref({
  id: null,
  name: '',
  buddhist_year: '',
  start_date: '',
  end_date: '',
  active: 1
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

const fetchTopics = async () => {
  loading.value = true
  try {
    const res = await axios.get('http://localhost:7000/api/admin/periodslist')
    topics.value = res.data
  } catch (err) {
    console.error(err)
  }
  loading.value = false
}

const editTopic = (item) => {
  form.value = {
    id: item.id,
    name: item.period_name,           // ✅ map ชื่อให้ตรง
    buddhist_year: item.year,
    start_date: item.start_date,
    end_date: item.end_date,
    active: item.active
  }

  dialogEdit.value = true
}

const submitTopic = async () => {
  try {
    await axios.put(
      `http://localhost:7000/api/topics/${form.value.id}`,
      form.value
    )
    dialogEdit.value = false
    fetchTopics()
  } catch (err) {
    console.error(err)
  }
}

const deleteTopic = async (id) => {
  if (!confirm('ยืนยันการลบ?')) return
  await axios.delete(`http://localhost:7000/api/topics/${id}`)
  fetchTopics()
}

onMounted(fetchTopics)
</script>

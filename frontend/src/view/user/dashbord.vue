<template>
  <v-container fluid>
    <h2 class="mb-4">แดชบอร์ดผู้รับการประเมิน</h2>

    <!-- สรุป -->
    <v-row>
      <v-col cols="12" md="4">
        <v-card color="blue-lighten-4">
          <v-card-text>
            <div class="text-h6">สถานะการประเมิน</div>
            <div class="text-h5 font-weight-bold">{{ status }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="green-lighten-4">
          <v-card-text>
            <div class="text-h6">คะแนนรวม</div>
            <div class="text-h4 font-weight-bold">{{ totalScore }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="orange-lighten-4">
          <v-card-text>
            <div class="text-h6">ตัวชี้วัดทั้งหมด</div>
            <div class="text-h4 font-weight-bold">{{ indicators }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row><br><br>

    <!-- ✅ ตารางหัวข้อประเมิน -->
<!-- ตารางแสดงหัวข้อการประเมิน -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="topics"
        :loading="loading"
      >
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title class="text-center">รายการหัวข้อการประเมินทั้งหมด</v-toolbar-title>
          </v-toolbar>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const status = ref('')
const totalScore = ref(0)
const indicators = ref(0)
const topics = ref([])

const loading = ref(false)

const headers = [
   { title: 'ลำดับ', key: 'id' },
  { title: 'หัวข้อการประเมิน', key: 'name' },
  { title: 'ปีที่้เริ่ม',  key: 'buddhist_year' },
  { title: 'วันที่เริ่ม',  key: 'start_date' },
  { title: 'วันที่จบ',  key: 'end_date' },
  { title: 'สถานะ',  key: '	active' },
]

const fetchTopics = async () => {
  loading.value = true
  try {
    const res = await axios.get('http://localhost:7000/api/admin/periodslist')
    console.log(res.data)
    topics.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const goToScore = (indicatorId) => {
  router.push({
    path: '/user/score',
    query: { indicatorId }
  })
}


onMounted(fetchTopics)
</script>

<template>
  <v-container fluid>
    <!-- ✅ ตารางความคืบหน้า -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="topics"
        :loading="loading"
        item-value="id"
      >
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title>หัวข้อการประเมินหลัก</v-toolbar-title>
          </v-toolbar>
        </template>

        <!-- ✅ ปุ่มดูความคืบหน้า -->
        <template #item.action="{ item }">
          <v-btn
            color="info"
            size="small"
            prepend-icon="mdi-chart-line"
            @click="goToProgress(item.id)"
          >
            ประเมิน
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

/* ✅ router */
const router = useRouter()

/* ✅ state */
const indicators = ref(0)
const topics = ref([])
const loading = ref(false)

/* ✅ headers ตาราง */
const headers = [
  { title: 'ลำดับ', key: 'id' },
  { title: 'หัวข้อการประเมิน', key: 'name' },
  { title: 'ปีที่เริ่ม', key: 'buddhist_year' },
  { title: 'วันที่เริ่ม', key: 'start_date' },
  { title: 'วันที่จบ', key: 'end_date' },
  { title: 'การทำรายการ', key: 'action' }
]

/* ✅ ดึงข้อมูลหัวข้อประเมิน */
const fetchTopics = async () => {
  loading.value = true
  try {
    const res = await axios.get(
      'http://localhost:7000/api/admin/periodslist'
    )

    topics.value = res.data.map((item, index) => ({
      ...item,
    }))

    indicators.value = topics.value.length
  } catch (err) {
    console.error('โหลดข้อมูลไม่สำเร็จ', err)
  } finally {
    loading.value = false
  }
}

/* ✅ ไปหน้าดูความคืบหน้า */
const goToProgress = (periodId) => {
  router.push({
    path: '/user/estimate',
    query: { periodId }
  })
}

onMounted(fetchTopics)
</script>

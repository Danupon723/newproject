<template>
  <v-container fluid>
    <h2 class="mb-4">แดชบอร์ดผู้รับการประเมิน</h2>

    <!-- ✅ สรุปด้านบน -->
    <v-row>
      <v-col cols="12" md="4">
        <v-card color="blue-lighten-4">
          <v-card-text>
            <div class="text-h6">สถานะการประเมิน</div>
            <div class="text-h5 font-weight-bold">
              {{ status }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="green-lighten-4">
          <v-card-text>
            <div class="text-h6">คะแนนรวม</div>
            <div class="text-h4 font-weight-bold">
              {{ totalScore }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="orange-lighten-4">
          <v-card-text>
            <div class="text-h6">หัวข้อทั้งหมด</div>
            <div class="text-h4 font-weight-bold">
              {{ indicators }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <br />

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
            <v-toolbar-title>ความคืบหน้าการประเมิน</v-toolbar-title>
          </v-toolbar>
        </template>

        <!-- ✅ progress -->
        <template #item.progress="{ item }">
          <v-progress-linear
            :model-value="item.progress"
            height="18"
            rounded
            color="primary"
          >
            <strong class="text-white">
              {{ item.progress }}%
            </strong>
          </v-progress-linear>
        </template>

        <!-- ✅ ปุ่มดูความคืบหน้า -->
        <template #item.action="{ item }">
          <v-btn
            color="info"
            size="small"
            prepend-icon="mdi-chart-line"
            @click="goToProgress(item.id)"
          >
            ดูความคืบหน้า
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
const status = ref('กำลังประเมิน')
const totalScore = ref(0)
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
  { title: 'ความคืบหน้า (%)', key: 'progress' },
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
      progress: item.progress ?? 0
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
    path: '/user/comment',
    query: { periodId }
  })
}

onMounted(fetchTopics)
</script>

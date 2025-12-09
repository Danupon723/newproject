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
            <div class="text-h6">ผู้รับการประเมินทั้งหมด</div>
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
            <v-toolbar-title class="text-center text-primary">รายชื่อผู้รับการประเมิน</v-toolbar-title>
          </v-toolbar>
        </template>

        <!-- ✅ progress -->
        <template #item.self_score="{ item }">
          <v-chip
            color="green"
            text-color="white"
            variant="flat"
          >
            {{ item.self_score ?? '-' }}
          </v-chip>
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
        <template #item.detail="{ item }">
        <v-btn
          color="secondary"
          size="small"
          prepend-icon="mdi-file-document-outline"
          @click="goToDetail(item.id)"
        >
          รายละเอียด
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
  { title: 'คะแนนประเมินตนเอง', key: 'self_score' },
  { title: 'การทำรายการ', key: 'action' },
  { title: 'รายละเอียด', key: 'detail' } 
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
      progress: item.progress ?? 0 ,
      self_score: item.self_score ?? 0
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
    path: '/Assessor/topicass',
    query: { periodId }
  })
}

const goToDetail = (periodId) => {
  router.push({
    path: '/Assessor/topicass',
    query: { periodId }
  })
}

onMounted(fetchTopics)
</script>

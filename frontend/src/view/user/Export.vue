<template>
  <v-container>
    <!-- ✅ หัวหน้า -->
    <v-row class="mb-4">
      <v-col>
        <v-btn
          variant="text"
          color="primary"
          prepend-icon="mdi-arrow-left"
          @click="router.back()"
        >
          ย้อนกลับ
        </v-btn>
      </v-col>
    </v-row>

    <h2 class="mb-4">ความคืบหน้าการประเมิน</h2>

    <!-- ✅ ข้อมูลสรุป -->
    <v-card class="mb-6">
      <v-card-text>
        <div class="text-h6">{{ periodName }}</div>

        <v-progress-linear
          :model-value="totalProgress"
          height="20"
          rounded
          color="success"
          class="mt-3"
        >
          <strong class="text-white">
            {{ totalProgress }}%
          </strong>
        </v-progress-linear>
      </v-card-text>
    </v-card>

    <!-- ✅ ตารางตัวชี้วัด -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="indicators"
        :loading="loading"
        item-value="id"
      >
        <!-- ✅ คะแนน/ความคืบหน้า -->
        <template #item.progress="{ item }">
          <v-progress-linear
            :model-value="item.progress"
            height="14"
            rounded
            color="primary"
          >
            <small class="text-white">{{ item.progress }}%</small>
          </v-progress-linear>
        </template>

        <!-- ✅ ความคิดเห็นผู้ประเมิน -->
        <template #item.comment="{ item }">
          <v-chip
            v-if="item.comment"
            color="blue-lighten-4"
            label
          >
            {{ item.comment }}
          </v-chip>
          <span v-else class="text-grey">ยังไม่มีความคิดเห็น</span>
        </template>
      </v-data-table>
    </v-card>

    <!-- ✅ ปุ่ม Export PDF -->
    <v-row class="mt-6" justify="end">
      <v-btn
        color="red-darken-1"
        prepend-icon="mdi-file-pdf-box"
        @click="exportPDF"
      >
        Export PDF
      </v-btn>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

/* ✅ state */
const loading = ref(false)
const periodId = route.query.periodId

const periodName = ref('')
const totalProgress = ref(0)
const indicators = ref([])

/* ✅ table header */
const headers = [
  { title: 'ตัวชี้วัด', key: 'name' },
  { title: 'ความคืบหน้า (%)', key: 'progress' },
  { title: 'ความคิดเห็นผู้ประเมิน', key: 'comment' }
]

/* ✅ ดึงข้อมูลความคืบหน้า */
const fetchProgress = async () => {
  loading.value = true
  try {
    // ✅ ตัวอย่าง API (คุณเปลี่ยนตาม backend ได้)
    const res = await axios.get(
      `http://localhost:7000/api/evaluate/progress/${periodId}`
    )

    periodName.value = res.data.periodName
    indicators.value = res.data.indicators

    // ✅ คำนวณ progress รวม
    const sum = indicators.value.reduce(
      (acc, item) => acc + item.progress,
      0
    )
    totalProgress.value =
      indicators.value.length > 0
        ? Math.round(sum / indicators.value.length)
        : 0
  } catch (err) {
    console.error('โหลดข้อมูลไม่สำเร็จ', err)
  } finally {
    loading.value = false
  }
}

/* ✅ export PDF */
const exportPDF = () => {
  window.open(
    `http://localhost:7000/api/evaluate/export-pdf/${periodId}`,
    '_blank'
  )
}

onMounted(fetchProgress)
</script>

<template>
  <v-container>
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-4"
      @click="router.back()"
    >
      ย้อนกลับ
    </v-btn>

    <h2 class="mb-4">รายละเอียดการประเมิน</h2>

    <!-- หัวข้อการประเมิน -->
    <v-card class="mb-4" elevation="3" v-if="period.id">
      <v-card-title class="text-h6 text-primary">
        {{ period.name }}
      </v-card-title>
      <v-card-text>
        <div><strong>ปีประเมิน:</strong> {{ period.buddhist_year }}</div>
        <div>
          <strong>ช่วงเวลา:</strong>
          {{ period.start_date }} - {{ period.end_date }}
        </div>
      </v-card-text>
    </v-card>

    <!-- ตัวชี้วัด -->
    <v-card
      class="mb-4"
      elevation="2"
      v-for="(item, index) in indicators"
      :key="item.id"
    >
      <v-card-title>
        ตัวชี้วัดที่ {{ index + 1 }} : {{ item.title }}
      </v-card-title>

      <v-card-text>
        <div class="mb-3">
          <strong>รายละเอียดข้อมูล:</strong>
          <p class="mt-1">{{ item.description || '-' }}</p>
        </div>

        <div>
          <strong>หลักฐาน:</strong>

          <v-list v-if="item.files?.length" density="compact">
            <v-list-item
              v-for="file in item.files"
              :key="file.id"
              :href="file.url"
              target="_blank"
              prepend-icon="mdi-file-document"
            >
              {{ file.name }}
            </v-list-item>
          </v-list>

          <div v-else class="text-grey">
            ยังไม่มีไฟล์แนบ
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()

const periodId = route.query.periodId
const userId = route.query.userId   // ✅ ผู้รับการประเมิน

const period = ref({})
const indicators = ref([])

const fetchDetail = async () => {
  try {
    const res = await axios.get(
      'http://localhost:7000/api/assessor/evaluation-detail',
      {
        params: { periodId, userId }
      }
    )

    period.value = res.data.period
    indicators.value = res.data.indicators
  } catch (err) {
    console.error('โหลดรายละเอียดไม่สำเร็จ', err)
  }
}

onMounted(fetchDetail)
</script>

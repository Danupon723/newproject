<template>
  <v-container>
    <!-- ฟอร์มเพิ่มข้อมูล -->
    <v-card class="mb-6" elevation="4">
      <v-card-title class="text-h6">
        เพิ่มข้อมูลการประเมิน
      </v-card-title>

      <v-card-text>
        <v-row>
          <!-- dropdown -->
          <v-col cols="12" md="8">
            <v-select
              v-model="selectedPeriod"
              :items="periods"
              item-title="name"
              item-value="id"
              label="เลือกหัวข้อการประเมิน"
              variant="outlined"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              v-model="score"
              label="คะแนน"
              type="number"
              variant="outlined"
            />
          </v-col>

          <v-col cols="12">
            <v-btn
              block
              color="primary"
              :disabled="!selectedPeriod || !score"
              @click="save"
            >
              บันทึกข้อมูล
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- ✅ ตารางเดิมของคุณ (ไม่หาย) -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="periods"
        :loading="loading"
      >
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title>
              รายการหัวข้อการประเมิน
            </v-toolbar-title>
          </v-toolbar>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const periods = ref([])
const selectedPeriod = ref(null)
const score = ref('')
const loading = ref(false)

const headers = [
  { title: 'ลำดับ', key: 'id' },
  { title: 'หัวข้อการประเมิน', key: 'name' },
  { title: 'ปี', key: 'buddhist_year' },
  { title: 'วันเริ่ม', key: 'start_date' },
  { title: 'วันสิ้นสุด', key: 'end_date' },
  { title: 'สถานะ', key: 'active' }
]

// ✅ API เดียว
const fetchPeriods = async () => {
  loading.value = true
  try {
    const res = await axios.get(
      'http://localhost:7000/api/admin/periodslist'
    )
    periods.value = res.data
  } finally {
    loading.value = false
  }
}

const save = async () => {
  // ตรงนี้แค่ตัวอย่างการส่งค่า
  console.log('selected period:', selectedPeriod.value)
  console.log('score:', score.value)

  score.value = ''
  selectedPeriod.value = null
}

onMounted(fetchPeriods)
</script>

<template>
  <v-container>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="periods"
        :loading="loading"
      >
        <!-- หัวตาราง -->
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title>
              รายการหัวข้อการประเมิน
            </v-toolbar-title>
          </v-toolbar>
        </template>

        <!-- ✅ ปุ่มเพิ่มข้อมูล -->
        <template #item.action="{ item }">
          <v-btn
            color="primary"
            size="small"
            prepend-icon="mdi-plus-circle"
            @click="goToAddData(item.id)"
          >
            เพิ่มข้อมูล
          </v-btn>
        </template>

      </v-data-table>
    </v-card>
  </v-container>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const periods = ref([])
const loading = ref(false)

const headers = [
  { title: 'ลำดับ', key: 'id' },
  { title: 'หัวข้อการประเมิน', key: 'name' },
  { title: 'ปี', key: 'buddhist_year' },
  { title: 'วันเริ่ม', key: 'start_date' },
  { title: 'วันสิ้นสุด', key: 'end_date' },
  { title: 'สถานะ', key: 'active' },
  { title: 'จัดการ', key: 'action', sortable: false } // ✅ เพิ่มคอลัมน์
]

// ✅ API เดียว (ของเดิมคุณ)
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

// ✅ ไปหน้าเพิ่มข้อมูลของหัวข้อนั้น
const goToAddData = (periodId) => {
  router.push({
    path: '/user/score', // 🔧 เปลี่ยน path ตามจริง
    query: { periodId }
  })
}

onMounted(fetchPeriods)
</script>

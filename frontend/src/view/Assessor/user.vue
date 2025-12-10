<template>
  <v-container fluid>
    <h2 class="mb-4">แดชบอร์ดผู้รับการประเมิน</h2>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="users"
        :loading="loading"
        item-value="id"
      >
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title class="text-primary">
              รายชื่อผู้รับการประเมิน
            </v-toolbar-title>
          </v-toolbar>
        </template>

        <!-- ลำดับ -->
        <template #item.index="{ index }">
          {{ index + 1 }}
        </template>

        <!-- สถานะ -->
        <template #item.active="{ item }">
          <v-chip
            :color="item.active === 'ใช้งาน' ? 'green' : 'red'"
            text-color="white"
            size="small"
          >
            {{ item.active }}
          </v-chip>
        </template>

        <!-- คะแนน -->
        <template #item.score="{ item }">
          <v-chip color="green" text-color="white" variant="flat">
            {{ item.score }}
          </v-chip>
        </template>

        <!-- ✅ ปุ่ม (ไม่แตะตามที่ขอ) -->
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

const router = useRouter()

/* state */
const status = ref('กำลังประเมิน')
const totalScore = ref(0)
const users = ref([])
const loading = ref(false)

/* ✅ headers (อ้างอิงตารางแรก) */
const headers = [
  { title: 'ลำดับ', key: 'index' },
  { title: 'ชื่อผู้ใช้', key: 'name' },
  { title: 'อีเมล', key: 'email' },
  { title: 'ตำแหน่ง', key: 'role' },
  { title: 'แผนก', key: 'department_id' },
  { title: 'กลุ่ม', key: 'group_id' },
  { title: 'สถานะ', key: 'active' },
  { title: 'คะแนน', key: 'score' },
  { title: 'การประเมิน', key: 'action' },
  { title: 'รายละเอียด', key: 'detail' }
]

/* ✅ ดึงข้อมูลเดียวกับตารางแรก */
const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await axios.get(
      'http://localhost:7000/api/admin/userlist'
    )

    users.value = res.data.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      department_id: u.department_id,
      group_id: u.group_id,
      active: u.active,
      score: 0 // backend ยังไม่ส่ง → ใส่ไว้ก่อน
    }))

    totalScore.value = users.value.reduce(
      (sum, u) => sum + u.score,
      0
    )
  } catch (err) {
    console.error('โหลดข้อมูลไม่สำเร็จ', err)
  } finally {
    loading.value = false
  }
}

/* นำทาง */
const goToProgress = (userId) => {
  router.push({ path: '/Assessor/topicass', query: { userId } })
}

const goToDetail = (userId) => {
  router.push({ path: '/Assessor/userdetail', query: { userId } })
}

onMounted(fetchUsers)
</script>

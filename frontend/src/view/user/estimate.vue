<template>
  <v-container>
    <h2 class="mb-4">ประเมินตนเอง</h2>

    <v-card elevation="4">
      <v-card-title>
        กรอกข้อมูลการประเมิน
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="indicators"
        item-key="id"
      >
        <template #item.index="{ index }">
          {{ index + 1 }}
        </template>

        <!-- คะแนน -->
        <template #item.score="{ item }">
          <v-text-field
            v-model="item.score"
            type="number"
            min="0"
            max="5"
            density="compact"
            hide-details
          />
        </template>

        <!-- คำอธิบาย -->
        <template #item.comment="{ item }">
          <v-text-field
            v-model="item.comment"
            density="compact"
            hide-details
            placeholder="อธิบายผลการประเมิน"
          />
        </template>
      </v-data-table>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="success"
          size="large"
          @click="saveAssessment"
        >
          บันทึกผลการประเมิน
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const indicators = ref([])

const headers = [
  { title: 'ลำดับ', key: 'index' },
  { title: 'ตัวชี้วัด', key: 'name' },
  { title: 'คะแนน (0-5)', key: 'score' },
  { title: 'คำอธิบาย', key: 'comment' }
]

// ✅ โหลดตัวชี้วัดที่มีอยู่
const loadIndicators = async () => {
  const res = await axios.get(
    'http://localhost:7000/api/admin/indicators'
  )

  indicators.value = res.data.map(i => ({
    id: i.id,
    name: i.name,
    score: '',
    comment: ''
  }))
}

onMounted(loadIndicators)

// ✅ บันทึกข้อมูลการประเมิน (เพิ่มข้อมูลเข้าไป)
const saveAssessment = async () => {
  await axios.post(
    'http://localhost:7000/api/user/self-assessment',
    {
      assessments: indicators.value.map(i => ({
        indicatorId: i.id,
        score: i.score,
        comment: i.comment
      }))
    }
  )
  alert('บันทึกผลการประเมินเรียบร้อย')
}
</script>

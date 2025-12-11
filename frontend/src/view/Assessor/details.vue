<template>
  <v-container>

    <!-- Header -->
    <v-row class="mb-4">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold">
          ผู้รับการประเมิน: นายสมชาย รักดี
        </h2>
        <p>รอบการประเมินประจำปี 2568</p>
      </v-col>
    </v-row>

    <!-- แสดงข้อมูลการประเมิน -->
    <v-card class="mb-4">
      <v-card-title class="font-weight-bold">
        หัวข้อการประเมิน
      </v-card-title>

      <v-card-text>
        <p>
          <strong>หัวข้อ:</strong>
          {{ kpi.title }}
        </p>

        <p>
          <strong>ตัวชี้วัด:</strong>
          {{ kpi.indicator }}
        </p>

        <p>
          <strong>รายละเอียด:</strong>
          {{ kpi.description }}
        </p>

        <p>
          <strong>คะเเนนที่ประเมินตนเอง:</strong>
          {{ kpi.description }}
        </p>

        <p>
          <strong>หลักฐานประกอบ:</strong>
        </p>

        <ul v-if="kpi.evidences && kpi.evidences.length">
          <li v-for="(file, index) in kpi.evidences" :key="index">
            {{ file }}
          </li>
        </ul>

        <p v-else>- ไม่มีหลักฐานแนบ -</p>
      </v-card-text>
    </v-card>

  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const kpi = ref({
  title: 'การพัฒนาตนเอง',
  indicator: 'เข้าร่วมอบรมตามเป้าหมาย',
  description: 'เข้าร่วมอบรมอย่างน้อย 20 ชั่วโมงต่อปี',
  evidences: [
    'certificate.pdf',
    'training_report.docx'
  ]
})
</script>

<style scoped>
p {
  margin-bottom: 8px;
}
</style>
    
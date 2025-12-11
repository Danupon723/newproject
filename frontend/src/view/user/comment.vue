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

    <!-- KPI รายการ -->
    <v-row>
      <v-col cols="12" v-for="(kpi, index) in kpis" :key="kpi.id">
        <v-card class="mb-4">
          <v-card-title>
            <strong>{{ index + 1 }}.</strong>&nbsp;{{ kpi.title }}
          </v-card-title>

          <v-card-subtitle>
            เป้าหมาย: {{ kpi.description }}
          </v-card-subtitle>

          <v-divider class="my-2" />

          <v-card-text>
            <p>
              <strong>คะแนนประเมินตนเอง:</strong>
              {{ kpi.selfScore }}/4
            </p>

            <p>
              <strong>คะแนนผู้ประเมิน:</strong>
              {{ kpi.reviewerScore }}/4
            </p>

            <p>
              <strong>ความคิดเห็นตนเอง:</strong>
              {{ kpi.selfComment || '-' }}
            </p>

            <p>
              <strong>ความคิดเห็นผู้ประเมิน:</strong>
              {{ kpi.reviewerComment || '-' }}
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- สรุปคะแนน -->
    <v-card>
      <v-card-title class="font-weight-bold">
        สรุปคะแนน
      </v-card-title>
      <v-card-text>
        <p>คะแนนเฉลี่ยตนเอง: <strong>{{ avgSelfScore }}</strong></p>
        <p>คะแนนเฉลี่ยผู้ประเมิน: <strong>{{ avgReviewerScore }}</strong></p>
      </v-card-text>
    </v-card>

  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'

const kpis = ref([
  {
    id: 1,
    title: 'การพัฒนาตนเอง',
    description: 'เข้าร่วมอบรม 20 ชม./ปี',
    selfScore: 3,
    reviewerScore: 4,
    selfComment: 'เข้าร่วมอบรมตามเป้า',
    reviewerComment: 'พัฒนาตัวเองดีมาก'
  }
])

const avgSelfScore = computed(() => {
  return (
    kpis.value.reduce((sum, k) => sum + (k.selfScore || 0), 0) /
    kpis.value.length
  ).toFixed(2)
})

const avgReviewerScore = computed(() => {
  return (
    kpis.value.reduce((sum, k) => sum + (k.reviewerScore || 0), 0) /
    kpis.value.length
  ).toFixed(2)
})
</script>

<style scoped>
p {
  margin-bottom: 6px;
}
</style>

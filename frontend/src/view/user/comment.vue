<template>
  <v-app>
    <!-- AppBar -->
    <v-app-bar color="primary" elevation="2">
      <v-app-bar-nav-icon icon="mdi-arrow-left" @click="goBack"></v-app-bar-nav-icon>
      <v-toolbar-title>รายละเอียดการประเมิน</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <!-- Header -->
        <v-row class="mb-4">
          <v-col cols="12">
            <h2 class="text-h5 font-weight-bold">ผู้รับการประเมิน: นายสมชาย รักดี</h2>
            <p>รอบการประเมินประจำปี 2568 (ครั้งที่ 1)</p>
          </v-col>
        </v-row>

        <!-- KPI Details -->
        <v-row>
          <v-col cols="12" md="8" v-for="(kpi, index) in kpis" :key="kpi.id">
            <v-card class="mb-4" elevation="2">
              <v-card-title>
                <v-avatar color="primary" size="32" class="me-2">{{ index + 1 }}</v-avatar>
                <div>
                  <div class="font-weight-bold">{{ kpi.title }}</div>
                  <div class="text-body-2">เป้าหมาย: {{ kpi.description }}</div>
                </div>
              </v-card-title>

              <v-divider></v-divider>

              <v-card-text>
                <!-- Self-Assessment Score -->
                <div class="mb-2">
                  <span class="font-weight-bold">คะแนนประเมินตนเอง: </span>
                  <span :class="getScoreColor(kpi.selfScore)">
                    {{ kpi.selfScore }}/4
                  </span>
                </div>

                <!-- Reviewer Score -->
                <div class="mb-2">
                  <span class="font-weight-bold">คะแนนผู้ประเมิน: </span>
                  <span :class="getScoreColor(kpi.reviewerScore)">
                    {{ kpi.reviewerScore }}/4
                  </span>
                </div>

                <!-- Self Comment -->
                <div class="mb-2">
                  <span class="font-weight-bold">ความคิดเห็นตนเอง: </span>
                  <span>{{ kpi.selfComment || '-' }}</span>
                </div>

                <!-- Reviewer Comment -->
                <div>
                  <span class="font-weight-bold">ความคิดเห็นผู้ประเมิน: </span>
                  <span>{{ kpi.reviewerComment || '-' }}</span>
                </div>

                <!-- Attached Evidence -->
                <div v-if="kpi.files && kpi.files.length" class="mt-2">
                  <span class="font-weight-bold">หลักฐานที่แนบ:</span>
                  <v-chip
                    v-for="(file, i) in kpi.files"
                    :key="i"
                    class="mr-1 mb-1"
                    small
                    color="blue-grey-lighten-4"
                  >
                    <v-icon start small>mdi-paperclip</v-icon>{{ file }}
                  </v-chip>
                </div>

                <!-- Links -->
                <div v-if="kpi.links && kpi.links.length" class="mt-2">
                  <span class="font-weight-bold">ลิงก์ที่แนบ:</span>
                  <v-chip
                    v-for="(link, i) in kpi.links"
                    :key="i"
                    class="mr-1 mb-1"
                    small
                    color="blue-lighten-4"
                  >
                    <v-icon start small>mdi-web</v-icon>
                    <a :href="link" target="_blank">{{ link }}</a>
                  </v-chip>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Summary Sidebar -->
          <v-col cols="12" md="4">
            <v-card elevation="2" class="position-sticky" style="top: 80px;">
              <v-card-title class="bg-blue-grey-lighten-5 text-primary font-weight-bold">
                สรุปคะแนน
              </v-card-title>
              <v-card-text class="pt-4">
                <div class="d-flex justify-space-between mb-2">
                  <span>คะแนนเฉลี่ยตนเอง:</span>
                  <span class="font-weight-bold text-primary">{{ avgSelfScore }}</span>
                </div>
                <div class="d-flex justify-space-between mb-2">
                  <span>คะแนนเฉลี่ยผู้ประเมิน:</span>
                  <span class="font-weight-bold text-primary">{{ avgReviewerScore }}</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { ref, computed } from "vue";

export default {
  name: "AssessmentDetail",
  setup() {
    const kpis = ref([
      {
        id: 1,
        title: "การพัฒนาตนเอง",
        description: "เข้าร่วมอบรม 20 ชม./ปี",
        selfScore: 3,
        reviewerScore: 4,
        selfComment: "เข้าร่วมอบรมตามเป้า",
        reviewerComment: "พัฒนาตัวเองดีมาก",
        files: ["certificate.pdf"],
        links: ["https://github.com/somchai/project-a"]
      },
      {
        id: 2,
        title: "ผลสำเร็จของงาน",
        description: "ส่งมอบงานตรงเวลา 95% ขึ้นไป",
        selfScore: 4,
        reviewerScore: 3,
        selfComment: "ส่งงานตรงเวลา",
        reviewerComment: "บางงานต้องปรับปรุงคุณภาพ",
        files: [],
        links: []
      },
      {
        id: 3,
        title: "การทำงานเป็นทีม",
        description: "ให้ความร่วมมือเพื่อนร่วมงาน",
        selfScore: 3,
        reviewerScore: 4,
        selfComment: "ช่วยเหลือเพื่อนร่วมงานได้ดี",
        reviewerComment: "มีความร่วมมือสูง",
        files: [],
        links: []
      }
    ]);

    const getScoreColor = (score) => {
      if (score === 4) return "text-green";
      if (score === 3) return "text-blue";
      if (score === 2) return "text-orange";
      return "text-red";
    };

    const avgSelfScore = computed(() => {
      const scores = kpis.value.map((k) => k.selfScore || 0);
      return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
    });

    const avgReviewerScore = computed(() => {
      const scores = kpis.value.map((k) => k.reviewerScore || 0);
      return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
    });

    const goBack = () => {
      window.history.back();
    };

    return { kpis, getScoreColor, avgSelfScore, avgReviewerScore, goBack };
  },
};
</script>

<style scoped>
.v-application {
  font-family: 'Sarabun', sans-serif !important;
}
</style>

<template>
  <v-app>
    <!-- AppBar -->
    <v-app-bar color="primary" elevation="2">
      <v-app-bar-nav-icon icon="mdi-arrow-left" @click="goBack"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <div class="d-flex flex-column">
          <span class="text-subtitle-1 font-weight-bold">ระบบประเมินบุคลากร</span>
          <span class="text-caption">ผู้รับการประเมิน: นายสมชาย รักดี</span>
        </div>
      </v-toolbar-title>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="bg-grey-lighten-4">
      <v-container>
        <!-- Header Section -->
        <v-row class="mb-2">
          <v-col cols="12">
            <div class="d-flex justify-space-between align-center flex-wrap">
              <div>
                <h1 class="text-h5 font-weight-bold text-primary">
                  แบบประเมินตนเอง (Self-Assessment)
                </h1>
                <p class="text-body-2 text-medium-emphasis">
                  รอบการประเมินประจำปี 2568 (ครั้งที่ 1)
                </p>
              </div>
              <div class="d-flex align-center mt-2 mt-sm-0">
                <v-chip :color="progressColor" class="mr-2" label>
                  <v-icon start>mdi-chart-donut</v-icon>
                  ความคืบหน้า {{ progressPercentage }}%
                </v-chip>
                <v-btn color="grey-darken-1" variant="outlined" class="mr-2">
                  บันทึกร่าง
                </v-btn>
              </div>
            </div>
            <v-progress-linear
              :model-value="progressPercentage"
              :color="progressColor"
              height="10"
              rounded
              striped
              class="mt-4"
            />
          </v-col>
        </v-row>

        <!-- KPI Forms List -->
        <v-row>
          <v-col cols="12" md="8">
            <v-card
              class="mb-4"
              v-for="(kpi, index) in kpis"
              :key="kpi.id"
              elevation="1"
            >
              <v-card-title>
                <v-avatar color="primary" size="32" class="me-2">{{ index + 1 }}</v-avatar>
                <div>
                  <div class="font-weight-bold">{{ kpi.title }}</div>
                  <div class="text-body-2">เป้าหมาย: {{ kpi.description }}</div>
                </div>
              </v-card-title>

              <v-divider></v-divider>

              <v-card-text>
                <v-row>
                  <!-- Score Selection -->
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="kpi.score"
                      :items="scoreOptions"
                      item-title="text"
                      item-value="value"
                      label="คะแนนประเมินตนเอง"
                      variant="outlined"
                      density="comfortable"
                      color="primary"
                    />
                  </v-col>

                  <!-- Evidence Upload -->
                  <v-col cols="12" md="6">
                    <v-file-input
                      v-model="kpi.files"
                      label="อัปโหลดไฟล์หลักฐาน"
                      prepend-icon="mdi-paperclip"
                      variant="outlined"
                      density="comfortable"
                      multiple
                      show-size
                      accept=".pdf,.jpg,.png"
                    />

                    <v-btn
                      size="small"
                      variant="text"
                      color="primary"
                      prepend-icon="mdi-link-variant"
                      @click="addLink(kpi)"
                    >
                      เพิ่มลิงก์ (URL)
                    </v-btn>

                    <div v-if="kpi.links && kpi.links.length > 0" class="mt-1">
                      <v-chip
                        v-for="(link, i) in kpi.links"
                        :key="i"
                        size="small"
                        closable
                        @click:close="removeLink(kpi, i)"
                        class="mr-1 mb-1"
                        color="blue-grey-lighten-4"
                      >
                        <v-icon start size="small">mdi-web</v-icon>
                        {{ link }}
                      </v-chip>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Comment Section -->
            <v-card class="mb-4" elevation="1">
              <v-card-title>
                <v-icon start color="amber-darken-2">mdi-comment-text-outline</v-icon>
                ความคิดเห็นเพิ่มเติม / ปัญหาอุปสรรค
              </v-card-title>
              <v-card-text>
                <v-textarea
                  v-model="generalComment"
                  label="ระบุความคิดเห็น"
                  variant="outlined"
                  rows="3"
                  auto-grow
                  placeholder="เช่น สิ่งที่อยากให้บริษัทสนับสนุนเพิ่มเติม..."
                />
              </v-card-text>
            </v-card>

            <div class="d-flex justify-end mb-10">
              <v-btn
                color="success"
                size="large"
                elevation="4"
                prepend-icon="mdi-send"
                @click="submitDialog = true"
                :disabled="!isFormValid"
              >
                ยืนยันส่งแบบประเมิน
              </v-btn>
            </div>
          </v-col>

          <!-- Sidebar Summary -->
          <v-col cols="12" md="4">
            <v-card elevation="2" class="position-sticky" style="top: 80px;">
              <v-card-title class="bg-blue-grey-lighten-5 text-primary font-weight-bold">
                สรุปคะแนนประเมินตนเอง
              </v-card-title>
              <v-card-text class="pt-4">
                <div class="d-flex justify-space-between mb-2">
                  <span class="text-grey-darken-1">คะแนนรวมเฉลี่ย:</span>
                  <span class="text-h4 font-weight-bold text-primary">{{ averageScore }}</span>
                </div>
                <v-divider class="mb-4" />
                <div
                  v-for="(kpi, index) in kpis"
                  :key="'sum-'+index"
                  class="d-flex justify-space-between mb-1 text-body-2"
                >
                  <span class="text-truncate" style="max-width: 70%;">{{ index + 1 }}. {{ kpi.title }}</span>
                  <span v-if="kpi.score" class="font-weight-bold" :class="getScoreColor(kpi.score)">
                    {{ kpi.score }}/4
                  </span>
                  <span v-else class="text-grey-lighten-1">-</span>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-alert
                  v-if="!isFormValid"
                  type="warning"
                  variant="tonal"
                  density="compact"
                  class="text-caption w-100"
                  icon="mdi-alert-circle"
                >
                  กรุณากรอกคะแนนให้ครบทุกข้อ
                </v-alert>
                <v-alert
                  v-else
                  type="success"
                  variant="tonal"
                  density="compact"
                  class="text-caption w-100"
                  icon="mdi-check-circle"
                >
                  พร้อมส่งข้อมูล
                </v-alert>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Confirm Dialog -->
    <v-dialog v-model="submitDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5 text-center pt-6">
          <v-icon color="success" size="large" class="mb-2">mdi-check-decagram</v-icon><br />
          ยืนยันการส่งข้อมูล?
        </v-card-title>
        <v-card-text class="text-center">
          เมื่อยืนยันแล้ว ท่านจะไม่สามารถแก้ไขข้อมูลได้<br />จนกว่ากรรมการจะส่งคืนให้แก้ไข
        </v-card-text>
        <v-card-actions class="justify-center pb-6">
          <v-btn color="grey-darken-1" variant="text" @click="submitDialog = false">ยกเลิก</v-btn>
          <v-btn color="success" variant="flat" @click="confirmSubmit">ยืนยัน</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Link Dialog -->
    <v-dialog v-model="linkDialog" max-width="500">
      <v-card>
        <v-card-title>เพิ่มลิงก์หลักฐาน</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="tempLink"
            label="URL (เช่น Git, Google Drive)"
            variant="outlined"
            placeholder="https://"
            autofocus
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saveLink">เพิ่ม</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'SelfAssessment',
  setup() {
    const kpis = ref([
      { id: 1, title: 'การพัฒนาตนเอง', description: 'เข้าร่วมอบรม 20 ชม./ปี', score: null, files: [], links: ['https://github.com/somchai/project-a'] },
      { id: 2, title: 'ผลสำเร็จของงาน', description: 'ส่งมอบงานตรงเวลา 95% ขึ้นไป', score: null, files: [], links: [] },
      { id: 3, title: 'การทำงานเป็นทีม', description: 'ให้ความร่วมมือเพื่อนร่วมงาน', score: null, files: [], links: [] }
    ]);

    const scoreOptions = [
      { value: 4, text: 'ดีมาก (สูงกว่าคาดหวัง)' },
      { value: 3, text: 'ดี (ตามคาดหวัง)' },
      { value: 2, text: 'พอใช้ (ต่ำกว่าคาดหวัง)' },
      { value: 1, text: 'ปรับปรุง' },
    ];

    const generalComment = ref('');
    const submitDialog = ref(false);
    const linkDialog = ref(false);
    const tempLink = ref('');
    const currentKpiForLink = ref(null);

    const progressPercentage = computed(() => {
      const filled = kpis.value.filter(k => k.score !== null).length;
      return Math.round((filled / kpis.value.length) * 100);
    });

    const progressColor = computed(() => {
      if (progressPercentage.value < 50) return 'error';
      if (progressPercentage.value < 100) return 'warning';
      return 'success';
    });

    const averageScore = computed(() => {
      const scores = kpis.value.map(k => k.score).filter(s => s !== null);
      if (!scores.length) return '0.00';
      return (scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(2);
    });

    const isFormValid = computed(() => kpis.value.every(k => k.score !== null));

    const getScoreColor = score => {
      if(score===4) return 'text-green';
      if(score===3) return 'text-blue';
      if(score===2) return 'text-orange';
      return 'text-red';
    };

    const addLink = kpi => {
      currentKpiForLink.value = kpi;
      tempLink.value = '';
      linkDialog.value = true;
    };

    const saveLink = () => {
      if(tempLink.value && currentKpiForLink.value){
        currentKpiForLink.value.links.push(tempLink.value);
      }
      linkDialog.value = false;
    };

    const removeLink = (kpi,index) => {
      kpi.links.splice(index,1);
    };

    const confirmSubmit = () => {
      submitDialog.value = false;
      alert('บันทึกข้อมูลสำเร็จ! (Mockup)');
    };

      const goBack = () => {
      window.history.back();
    };
    return {
      kpis, scoreOptions, generalComment,
      submitDialog, linkDialog, tempLink,
      progressPercentage, progressColor, averageScore,
      isFormValid, getScoreColor, addLink, saveLink, removeLink, confirmSubmit
    };
  }
};

</script>

<style scoped>
body { font-family: 'Sarabun', sans-serif; }
.v-application { font-family: 'Sarabun', sans-serif !important; }
</style>

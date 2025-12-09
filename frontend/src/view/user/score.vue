<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">

        <!-- ปุ่มย้อนกลับ -->
        <v-btn
          class="mb-3 text-primary"
          variant="text"
          prepend-icon="mdi-arrow-left"
          @click="goBack"
        >
          ย้อนกลับ
        </v-btn>

        <v-card elevation="4">
          <v-card-title class="text-h6">
            เพิ่มข้อมูลการประเมิน
          </v-card-title>

          <v-card-text>
            <v-row>
              <!-- Dropdown -->
              <v-col cols="12">
                <v-select
                  v-model="selectedPeriod"
                  :items="periods"
                  item-title="name"
                  item-value="id"
                  label="เลือกหัวข้อการประเมิน"
                  variant="outlined"
                />
              </v-col>

              <!-- คะแนน -->
              <v-col cols="12">
                <v-text-field
                  v-model="score"
                  label="คะแนนการประเมิน"
                  type="number"
                  variant="outlined"
                />
              </v-col>

              <!-- ✅ แนบไฟล์ -->
              <v-col cols="12">
                <v-file-input
                  v-model="file"
                  label="แนบไฟล์ (ถ้ามี)"
                  variant="outlined"
                  prepend-icon="mdi-paperclip"
                  accept=".pdf,image/*"
                  show-size
                />
              </v-col>
              <!-- ✅ คำอธิบายเพิ่มเติม -->
            <v-col cols="12">
              <v-textarea
                v-model="description"
                label="คำอธิบายเพิ่มเติม"
                variant="outlined"
                rows="3"
                prepend-inner-icon="mdi-text"
              />
            </v-col>
              <!-- ปุ่มบันทึก -->
              <v-col cols="12">
                <v-btn
                  block
                  color="primary"
                  size="large"
                  :disabled="!selectedPeriod || !score"
                  @click="save"
                >
                  บันทึกข้อมูลการประเมิน
                </v-btn>
              </v-col>

            </v-row>
          </v-card-text>
        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const periods = ref([])
const selectedPeriod = ref(null)
const score = ref('')
const file = ref(null)
const loading = ref(false)
const description = ref('')

// ✅ ดึงหัวข้อประเมิน
const fetchPeriods = async () => {
  loading.value = true
  try {
    const res = await axios.get(
      'http://localhost:7000/api/admin/periodslist'
    )
    periods.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// ✅ บันทึกข้อมูล + ไฟล์
const save = async () => {
  const form = new FormData()
  form.append('period_id', selectedPeriod.value)
  form.append('score', score.value)
  form.append('description', description.value)
  if (file.value) {
    form.append('file', file.value)
  }

  // ✅ ตอนนี้ยัง console.log (พร้อมเอาไปยิง API จริง)
  console.log('form data', {
    period_id: selectedPeriod.value,
    score: score.value,
    file: file.value
  })

  // reset
  selectedPeriod.value = null
  score.value = ''
  description.value = ''
  file.value = null
}

// ✅ ย้อนกลับ
const goBack = () => router.back()

onMounted(fetchPeriods)
</script>

<template>
  <v-app>
    <v-container fluid>
      <v-card class="pa-6" elevation="4">
        <!-- ปีงบประมาณ -->
        <v-row>
          <v-col cols="12" md="6"><h2 class="text-h6">ปีงบประมาณ: <strong>{{ evaluationPeriod.fiscalYear }}</strong></h2></v-col>
          <v-col cols="12" md="6" class="text-md-right"><h2 class="text-h6 text-grey-darken-1">วันที่: <strong>{{ evaluationPeriod.dateRange }}</strong></h2></v-col>
        </v-row>
        <v-divider class="my-4"></v-divider>

        <!-- ตารางประเมิน -->
        <v-data-table-server :items="evaluationData" :loading="loading" :headers="headers" items-per-page="-1" hide-default-footer class="elevation-2">
          <template #top>
            <v-card color="green-darken-2" class="pa-2 text-center text-white font-weight-bold rounded-0">
              <v-row dense><v-col cols="3">หัวข้อการประเมิน</v-col><v-col cols="5">ตัวชี้วัด</v-col><v-col cols="4">คะแนน</v-col></v-row>
            </v-card>
          </template>

          <template #item="{ item }">
            <tr class="align-top">
              <td class="py-3 text-center" style="width:25%">{{ item.activity }}</td>
              <td class="py-3" style="width:50%">
                <p class="font-weight-medium">{{ item.indicator }}</p>
                <v-textarea v-model="item.assessmentText" label="กรอกข้อความ..." variant="outlined" rows="2" density="compact" hide-details class="mt-2"/>
                <v-text-field v-model="item.url" label="กรอก URL (ถ้ามี)" variant="outlined" dense hide-details class="mt-2"/>
                <v-file-input v-model="item.file" label="แนบไฟล์ (ถ้ามี)" variant="outlined" dense hide-details show-size truncate-length="15" class="mt-2"/>
              </td>
              <td class="py-3 text-center" style="width:25%">
                <v-checkbox v-model="item.hasScore" label="มี" dense hide-details class="mb-2"/>
                <v-radio-group v-if="item.hasScore" v-model="item.selectedScore" row density="compact" hide-details>
                  <v-col v-for="(desc,i) in scoreDescriptions" :key="i" class="d-flex flex-column align-center">
                    <v-radio :value="i+1" :label="String(i+1)"/><span class="text-caption">{{ desc }}</span>
                  </v-col>
                </v-radio-group>
              </td>
            </tr>
          </template>

          <template #no-data>
            <div class="text-center py-4">
              <v-icon size="40" color="grey-lighten-1">mdi-alert-circle-outline</v-icon>
              <p class="text-subtitle-1 text-grey-darken-1">ไม่พบข้อมูลการประเมิน</p>
            </div>
          </template>
        </v-data-table-server>

        <!-- ปุ่ม -->
        <v-row class="mt-6 justify-end">
          <v-col cols="auto">
            <v-btn color="warning" variant="flat" @click="handleSave" class="mr-3"><v-icon start>mdi-content-save</v-icon> บันทึก</v-btn>
            <v-btn color="grey-darken-1" variant="tonal" @click="handleCancel" class="mr-3"><v-icon start>mdi-close-circle-outline</v-icon> ยกเลิก</v-btn>
            <v-btn color="primary" variant="flat" @click="handleNext">ถัดไป <v-icon end>mdi-arrow-right</v-icon></v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const evaluationData = ref([])
const loading = ref(true)
const evaluationPeriod = ref({ fiscalYear:'2565', dateRange:'1 เมษายน 2565 ถึง 30 กันยายน 2565' })
const scoreDescriptions = ['ต่ำ','พอใช้','ดี','ดีมาก']
const headers = [{text:'กิจกรรม', value:'activity'},{text:'ตัวชี้วัด', value:'indicator'},{text:'คะแนน', value:'score'}]

// mock data
const mockData = [
  {id:1, activity:'งานในตำแหน่งหน้าที่', indicator:'ร้อยละของผลงานที่ได้รับมอบหมายตามตำแหน่งหน้าที่ (ค่าเป้าหมาย - ร้อยละ 80)', assessmentText:'', hasScore:false, selectedScore:null, url:'', file:null},
  {id:2, activity:'ประสิทธิภาพการปฏิบัติงาน', indicator:'(ค่าเป้าหมาย - ขึ้นอยู่กับประสิทธิภาพ) คะแนน 1 + สามารถทำงานที่ได้รับมอบหมาย', assessmentText:'', hasScore:false, selectedScore:null, url:'', file:null}
]

const loadData = async () => { loading.value=true; setTimeout(()=>{ evaluationData.value=mockData; loading.value=false },500) }

// ส่งข้อมูลไป backend
const handleSave = async () => {
  try {
    const formData = new FormData()
    evaluationData.value.forEach((item, idx)=>{
        console.log('ข้อมูลจากฟอร์ม = ', evaluationData.value)
      formData.append(`data[${idx}][activity]`, item.activity)
      formData.append(`data[${idx}][indicator]`, item.indicator)
      formData.append(`data[${idx}][assessmentText]`, item.assessmentText)
      formData.append(`data[${idx}][url]`, item.url)
      formData.append(`data[${idx}][hasScore]`, item.hasScore)
      formData.append(`data[${idx}][selectedScore]`, item.hasScore ? item.selectedScore : '')
      if(item.file) formData.append(`data[${idx}][file]`, item.file)
    })
    // เปลี่ยน URL ให้เป็น endpoint จริงของคุณ
    await axios.post('http://localhost:7000/api/evaluation', formData, { headers: { 'Content-Type':'multipart/form-data' } })
    alert('บันทึกเรียบร้อย')
  } catch(err) { console.error(err); alert('บันทึกไม่สำเร็จ') }
}

const handleNext = () => alert('ไปหน้าถัดไป (Mock)')
const handleCancel = () => alert('ยกเลิกการแก้ไข (Mock)')

onMounted(loadData)
</script>

<style scoped>
.text-center{text-align:center;}
.font-weight-medium{font-weight:500;}
.v-radio-group{justify-content:center;}
.v-textarea{width:100%;}
</style>

<template>
  <v-container>

    <!-- 🔹 2 ฟอร์ม อยู่ข้างกัน -->
    <v-row>
      <!-- ฟอร์มซ้าย : เพิ่มหัวข้อการประเมิน (เพิ่มได้แค่ 1 ครั้ง) -->
      <v-col cols="6">
        <v-card class="pa-6">
          <h2 class="text-h6 mb-4">เพิ่มหัวข้อการประเมิน</h2>

          <v-text-field
            v-model="mainTopic.nametopic"
            label="ชื่อหัวข้อการประเมิน"
            variant="outlined"
            :disabled="mainLocked"
          />

          <v-text-field
            v-model="mainTopic.dis"
            label="คำอธิบายหัวข้อ"
            variant="outlined"
            :disabled="mainLocked"
          />

          <v-btn
            color="primary"
            class="mt-4"
            block
            :disabled="mainLocked"
            @click="lockMainTopic"
          >
            {{ mainLocked ? 'ล็อคแล้ว' : 'ยืนยันหัวข้อ' }}
          </v-btn>
        </v-card>
      </v-col>

      <!-- ฟอร์มขวา : รายละเอียดคะแนน (เพิ่มได้เรื่อย ๆ) -->
      <v-col cols="6">
        <v-card class="pa-6">
          <h2 class="text-h6 mb-4">รายละเอียดคะแนน</h2>

          <v-text-field
            v-model="form.topic"
            label="ชื่อหัวข้อย่อย"
            variant="outlined"
            :disabled="!mainLocked"
          />

          <v-text-field
            v-model="form.discrip"
            label="คำอธิบายหัวข้อย่อย"
            variant="outlined"
            :disabled="!mainLocked"
          />

          <v-text-field
            v-model="form.score_add"
            label="น้ำหนักคะแนน"
            type="number"
            variant="outlined"
            :disabled="!mainLocked"
          />

          <v-select
            v-model="form.type"
            :items="type"
            label="ประเภท"
            variant="outlined"
            :disabled="!mainLocked"
          />

          <v-btn color="primary" class="mt-4" block @click="addToTable">
            เพิ่ม
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- 🔹 ตารางอยู่ด้านล่าง -->
    <v-card class="mt-6">
      <v-toolbar flat>
        <v-toolbar-title>รายการรายละเอียดคะแนน</v-toolbar-title>

        <v-spacer />

        <v-btn color="success" @click="submitToDB">
          บันทึกลงฐานข้อมูล
        </v-btn>
      </v-toolbar>

      <v-data-table
        :headers="headers"
        :items="topics"
      >
        <template #item.actions="{ item }">
          <v-btn icon color="red" @click="deleteRow(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

/* Dropdown ประเภท */
const type = ref(['ผู้ประเมิน', 'ผู้ถูกประเมิน'])

/* หัวข้อหลัก (เพิ่มได้ครั้งเดียว) */
const mainTopic = ref({
  nametopic: '',
  dis: ''
})

const mainLocked = ref(false)

/* ฟอร์มรายละเอียดคะแนน */
const form = ref({
  topic: '',
  discrip: '',
  score_add: '',
  type: ''
})

/* ตารางรายละเอียดคะแนน */
const topics = ref([])

/* Header ตาราง */
const headers = [
  { title: 'ชื่อหัวข้อ', key: 'nametopic' },
  { title: 'คำอธิบาย', key: 'dis' },
  { title: 'คะแนน', key: 'score' },
  { title: 'ประเภท', key: 'type' },
  { title: 'จัดการ', key: 'actions' }
]

/* ล็อคหัวข้อหลัก */
const lockMainTopic = () => {
  if (!mainTopic.value.nametopic || !mainTopic.value.dis) {
    alert('กรอกข้อมูลหัวข้อหลักให้ครบ')
    return
  }
  mainLocked.value = true
}

/* เพิ่มรายละเอียดเข้าตาราง */
const addToTable = () => {
  if (!mainLocked.value) {
    alert('กรุณายืนยันหัวข้อหลักก่อน')
    return
  }

  if (!form.value.topic || !form.value.score_add || !form.value.type) {
    alert('กรอกข้อมูลรายละเอียดให้ครบ')
    return
  }

  topics.value.push({
    nametopic: form.value.topic,
    dis: form.value.discrip,
    score: form.value.score_add,
    type: form.value.type
  })

  // ล้างฟอร์มรายละเอียด
  form.value = { topic: '', discrip: '', score_add: '', type: '' }
}

/* ลบแถว */
const deleteRow = (item) => {
  topics.value = topics.value.filter(t => t !== item)
}

/* บันทึกลงฐานข้อมูล */
const submitToDB = async () => {
  if (!mainLocked.value) {
    alert('ยังไม่ได้ยืนยันหัวข้อหลัก')
    return
  }

  if (topics.value.length === 0) {
    alert('ยังไม่มีรายละเอียดคะแนน')
    return
  }

  try {
    await axios.post(
      'http://localhost:7000/api/admin/createperiod',
      {
        mainTopic: mainTopic.value,
        details: topics.value
      }
    )

    alert('บันทึกสำเร็จ ✅')

    // รีเซ็ตทั้งหมด
    mainTopic.value = { nametopic: '', dis: '' }
    mainLocked.value = false
    topics.value = []
  } catch (err) {
    console.error(err)
    alert('บันทึกไม่สำเร็จ ❌')
  }
}
</script>

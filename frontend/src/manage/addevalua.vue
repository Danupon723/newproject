<template>
  <v-container class="mt-6" style="max-width: 600px;">
    <v-card class="pa-6">

      <h2 class="text-h5 mb-4 text-primary text-center"> <v-icon class="mr-6">mdi mdi-account-multiple-plus</v-icon>กำหนดผู้ถูกประเมิน</h2>
      <h5 class="text-center ">กำหนดผู้ถูกประเมินสำหรับ: ผู้อำนวยการ </h5>

      <v-form @submit.prevent="saveTopic">
    
    <v-select
      v-model="evalua_id"
      :items="evalua"
      label="เลือกครูที่ต้องการให้ประเมิน"
      variant="outlined"
    ></v-select>
        <!-- ปุ่มบันทึก -->
        <v-btn
          type="submit"
          color="primary"
          class="mt-4"
          block
        >
        <v-icon class="mr-6">mdi mdi-account-multiple-plus</v-icon>  
        เพิ่มผู้ใช้
        </v-btn>
      </v-form><br>

    <v-card>
      <v-data-table
        :headers="headers"
        :items="topics"
        :loading="loading"
      >
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title class="text-h6">รายการผู้ถูกประเมินที่กำหนดแล้ว:</v-toolbar-title>
          </v-toolbar>
        </template>
      </v-data-table>
    </v-card><br>
<div class="d-flex justify-end mb-3">
  <v-btn
    color="grey"
    height="40"
    width="80"
    @click="router.back()"
  >
    ย้อนกลับ
  </v-btn>
</div>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

// ✅ รับ id จาก URL เช่น /admin/topics/5/edit
const topicId = route.params.id

// ✅ ฟอร์มข้อมูลหัวข้อ
const form = ref({
  title: '',
  score: ''
})


const department = [
    'เทคโนโลยีสาระสนเทศ',
    'ช่างยนต์',
    'ไฟฟ้า',
    'คอมธุรกิจ',
    'ไฟฟ้ากำลัง',
  ]

   const group = [
    'เทคโนโลยีสาระสนเทศ',
    'ช่างยนต์',
    'ไฟฟ้า',
    'คอมธุรกิจ',
    'ไฟฟ้ากำลัง',
  ]

const headers = [
  { text: 'ID', value: 'id' },
  { text: 'ชื่อ', value: 'name' },
  { text: 'อีเมล', value: 'email' },
  { text: 'รหัสแผนก', value: 'department_id' },
  { text: 'สถานะ', value: 'active' },
  { text: 'จัดการ', value: 'actions', sortable: false },
]


// ✅ โหลดข้อมูลหัวข้อเดิมมาแสดง
onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:7000/api/topics/${topicId}`)

    // ✅ กรณี API ส่งกลับ { status: true, data: {...} }
    form.value = res.data.data

  } catch (err) {
    console.error('โหลดหัวข้อไม่สำเร็จ:', err)
  }
})

// ✅ บันทึกการแก้ไข
const saveTopic = async () => {
  try {
    await axios.put(
      `http://localhost:7000/api/topics/${topicId}`,
      form.value
    )

    alert('บันทึกการแก้ไขสำเร็จ')
    router.push('/admin/topics') // ✅ กลับไปหน้ารายการหัวข้อ
  } catch (err) {
    console.error('บันทึกไม่สำเร็จ:', err)
  }
}
</script>

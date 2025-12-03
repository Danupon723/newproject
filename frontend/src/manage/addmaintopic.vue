<template>
  <v-container class="mt-6" style="max-width: 600px;">
    <v-card class="pa-6">

      <h2 class="text-h5 mb-4">เพิ่มหัวข้อการประเมิน</h2>

      <v-form @submit.prevent="saveTopic">
        <!-- ชื่อหัวข้อ -->
        <v-text-field
          v-model="form.main"
          label="ชื่อหัวข้อการประเมิน"
          variant="outlined"
          required
        />

        <v-text-field
          v-model="form.yeas"
          type="number"
          label="ปีการประเมิน"
          variant="outlined"
          required
        />

        <v-text-field
          v-model="form.start"
          label="กำหนดเวลาเปิด"
          type="date"
          variant="outlined"
          required
        />

        <v-text-field
          v-model="form.end"
          label="กำหนดเวลาปิด"
          type="date"
          variant="outlined"
          required
        />

        <!-- ปุ่มบันทึก -->
        <v-btn
          type="submit"
          color="primary"
          class="mt-4"
          block
        >
          เพิ่มหัวข้อประเมิน
        </v-btn>

        <!-- ปุ่มย้อนกลับ -->
        <v-btn
          class="mt-2"
          color="grey"
          block
          @click="router.back()"
        >
          ย้อนกลับ
        </v-btn>
      </v-form>

    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// ✅ ฟอร์มสำหรับเพิ่มข้อมูลใหม่
const form = ref({
  main: '',
  yeas: '',
  start: '',
  end: ''
})

// ✅ ฟังก์ชันเพิ่มข้อมูลลงฐานข้อมูลจริง
const saveTopic = async () => {
  try {
    console.log(form)
    const res = await axios.post(
      'http://localhost:7000/api/admin/createperiod',
      form.value
    )

    console.log('API RESPONSE:', res.data)
    alert('เพิ่มหัวข้อการประเมินสำเร็จ ✅')

    router.push('/admin/topic') // กลับหน้ารายการ
  } catch (err) {
    console.error('เพิ่มข้อมูลไม่สำเร็จ:', err)

    // alert('เพิ่มข้อมูลไม่สำเร็จ ❌')
  }
}
</script>

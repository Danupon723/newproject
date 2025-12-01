<template>
  <v-container class="mt-6" style="max-width: 600px;">
    <v-card class="pa-6">

      <h2 class="text-h5 mb-4">แก้ไขหัวข้อการประเมิน</h2>

      <v-form @submit.prevent="saveTopic">
        <!-- ชื่อหัวข้อ -->
        <v-text-field
          v-model="form.title"
          label="ชื่อหัวข้อการประเมิน"
          variant="outlined"
          required
        />

        <!-- คะแนน -->
        <v-text-field
          v-model="form.score"
          label="คะแนนเต็ม"
          type="number"
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
          บันทึกการแก้ไข
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

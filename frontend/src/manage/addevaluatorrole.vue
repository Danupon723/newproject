<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh;">
    <!-- ฟอร์มเดียว -->
    <v-card class="pa-6" style="max-width: 600px; width: 100%;">
      <h2 class="text-h6 mb-4 text-center">เพิ่มรายการ</h2>

      <!-- Dropdown 1 -->
      <v-select
        v-model="form.periods"
        :items="periods"
           item-title="name"
        item-value="id"
        label="เลือกผู้ใช้"
        variant="outlined"
      />

      <!-- Dropdown 2 : แผนก -->
      <v-select
        v-model="form.evaluators"
        :items="evaluators"
        item-title="name"
        item-value="id"
        label="เลือกแผนก"
        variant="outlined"
        class="mt-4"
      />

      <!-- Dropdown 3 -->
      <v-select
        v-model="form.evaluatees"
        :items="evaluatees"
        item-title="name"
        item-value="id"
        label="เลือกผู้ที่จะประเมิน"
        variant="outlined"
        class="mt-4"
      />

      <!-- คำอธิบาย -->
      <v-text-field
        v-model="form.description"
        label="คำอธิบาย"
        variant="outlined"
        class="mt-4"
      />

      <v-btn color="primary" class="mt-4" block @click="submitForm">
        เพิ่ม
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'


// Dropdown options
const periods = ref([])
const evaluators = ref([])
const evaluatees = ref([])


const form = ref({
  periods: '',
  evaluators: '',
  evaluatees: '',
  description: ''
})

// โหลดข้อมูล API
async function loadDepartments() {
  try {
    const res = await axios.get('http://localhost:7000/api/admin/itemassignments')
    periods.value = res.data.period
    evaluators.value = res.data.evaluator
    evaluatees.value = res.data.evaluatee
  } catch (err) {
    console.error('โหลดข้อมูลไม่สำเร็จ', err)
  }
}

onMounted(() => {
  loadDepartments()
})

// ⭐ เมื่อเลือกผู้ใช้ → auto เลือกแผนกตามผู้ใช้
watch(() => form.value.evaluatees, (newVal) => {
  const user = evaluatees.value.find(u => u.id === newVal)
  if (user) {
    form.value.description = user.deprt_name   // ให้ช่องแผนกเปลี่ยนอัตโนมัติ
  }
})

const submitForm = async () => {
  if (!form.value.periods || !form.value.evaluators || !form.value.evaluatees || !form.value.description) {
    alert('กรอกข้อมูลให้ครบทุกช่อง')
    return
  }

  console.log('ข้อมูลที่ส่ง:', { ...form.value })

    const payload = {
    periodId: form.value.periods,
    evaluatorId: form.value.evaluators,
    evaluateeId: form.value.evaluatees,
    departmentId: form.value.evaluatorDeptId, // ถ้าใช้ ID แทนชื่อ
    description: form.value.description
  }
  const res = await axios.post('http://localhost:7000/api/admin/createassignment' , payload)
}
</script>


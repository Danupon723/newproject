<script setup>
import { ref, onMounted, computed } from 'vue';

// ------------------------------------------
// 1. STATE & DATA
// ------------------------------------------

// สถานะการโหลด
const loading = ref(true); 
// ข้อมูลผู้ประเมินทั้งหมด (Appraisers)
const appraisers = ref([]); 
// ข้อมูลผู้รับการประเมินทั้งหมด (Appraisees)
const appraisees = ref([]);
// สถานะสำหรับเปิด/ปิด Dialog จัดการการมอบหมาย
const assignmentDialog = ref(false); 
// ผู้ประเมินที่ถูกเลือกเพื่อจัดการการมอบหมาย
const selectedAppraiser = ref(null); 
// รายชื่อผู้รับการประเมินที่ถูกมอบหมายแล้ว (IDs) สำหรับผู้ประเมินที่เลือก
const assignedAppraiseeIds = ref([]); 

// Mock Headers สำหรับตารางผู้ประเมิน
const appraiserHeaders = [
  { title: 'รหัสพนักงาน', key: 'id', width: '15%' },
  { title: 'ชื่อผู้ประเมิน', key: 'name', width: '30%' },
  { title: 'จำนวนผู้รับการประเมินที่มอบหมาย', key: 'assigned_count', sortable: false, width: '30%' },
  { title: 'จัดการ', key: 'actions', sortable: false, align: 'center', width: '25%' },
];

// Mock Data: ผู้ประเมิน
const mockAppraisers = [
  { id: 'A001', name: 'นาย A เจริญกิจ (ผู้จัดการ)', assignments: ['E003', 'E005'] },
  { id: 'A002', name: 'นางสาว B สุขุมวิท (หัวหน้า)', assignments: ['E001', 'E002', 'E004', 'E006'] },
  { id: 'A003', name: 'นาย C วัฒนา (ผู้ช่วย)', assignments: ['E007'] },
];

// Mock Data: ผู้รับการประเมิน
const mockAppraisees = [
  { id: 'E001', name: 'นาย ก ขยันดี', department: 'บัญชี' },
  { id: 'E002', name: 'นางสาว ข ตั้งใจจริง', department: 'การตลาด' },
  { id: 'E003', name: 'นาย ค ทำงานเร็ว', department: 'บุคคล' },
  { id: 'E004', name: 'นาง ง อดทนมาก', department: 'บัญชี' },
  { id: 'E005', name: 'นาย จ ประหยัดทรัพย์', department: 'การตลาด' },
  { id: 'E006', name: 'นางสาว ฉ ปลอดภัย', department: 'บุคคล' },
  { id: 'E007', name: 'นาย ช สุขสันต์', department: 'การตลาด' },
];

// ------------------------------------------
// 2. COMPUTED PROPERTIES
// ------------------------------------------

// คำนวณรายชื่อผู้รับการประเมินที่ถูกเลือกใน Dialog
const appraiseesWithAssignmentStatus = computed(() => {
  if (!appraisees.value.length) return [];
  
  // จัดเรียง Appraisees ตามการกำหนดสิทธิ์: ถูกมอบหมาย (true) มาก่อน
  return appraisees.value.map(appraisee => ({
    ...appraisee,
    assigned: assignedAppraiseeIds.value.includes(appraisee.id),
  })).sort((a, b) => (b.assigned - a.assigned)); 
});

// ------------------------------------------
// 3. API SIMULATION (Mock Fetch/Save)
// ------------------------------------------

/**
 * @description จำลองการโหลดข้อมูลผู้ประเมินและผู้รับการประเมิน
 */
const loadInitialData = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      // เพิ่มจำนวนผู้รับการประเมินที่มอบหมายแล้วในข้อมูลหลัก
      const data = mockAppraisers.map(appraiser => ({
        ...appraiser,
        assigned_count: appraiser.assignments.length,
      }));
      resolve({ appraisers: data, appraisees: mockAppraisees });
    }, 800);
  });
};

/**
 * @description จำลองการบันทึกการมอบหมาย
 * @param {Object} appraiser - ข้อมูลผู้ประเมิน
 * @param {Array} newAssignments - ID ของผู้รับการประเมินที่ถูกเลือกใหม่
 */
const saveAssignments = (appraiserId, newAssignments) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 1. อัปเดตข้อมูลใน State (Mock Backend)
      const index = appraisers.value.findIndex(a => a.id === appraiserId);
      if (index !== -1) {
        appraisers.value[index].assignments = newAssignments;
        appraisers.value[index].assigned_count = newAssignments.length;
      }
      
      console.log(`[API MOCK] บันทึกการมอบหมายสำหรับ ${appraiserId} สำเร็จ`);
      resolve({ success: true, message: 'บันทึกการมอบหมายเรียบร้อยแล้ว' });
    }, 500);
  });
};


// ------------------------------------------
// 4. METHODS / ACTIONS
// ------------------------------------------

/**
 * @description เปิด Dialog จัดการการมอบหมายและโหลดข้อมูลผู้รับการประเมินที่เกี่ยวข้อง
 * @param {Object} appraiser - ผู้ประเมินที่เลือก
 */
const openAssignmentDialog = (appraiser) => {
  selectedAppraiser.value = appraiser;
  // คัดลอก ID ของผู้ที่ถูกมอบหมายแล้วมาไว้ใน State เพื่อจัดการใน Dialog
  assignedAppraiseeIds.value = [...appraiser.assignments]; 
  assignmentDialog.value = true;
};

/**
 * @description บันทึกการมอบหมายที่ถูกเลือกใน Dialog
 */
const confirmAssignment = async () => {
  if (!selectedAppraiser.value) return;

  const appraiserId = selectedAppraiser.value.id;
  const assignmentsToSave = assignedAppraiseeIds.value;

  try {
    loading.value = true;
    await saveAssignments(appraiserId, assignmentsToSave);
    
    // ปิด Dialog และรีเซ็ตค่า
    assignmentDialog.value = false;
    selectedAppraiser.value = null;
    
    // แสดง Notification (แทนที่ด้วย v-snackbar จริงใน Production)
    alert('บันทึกการมอบหมายสำเร็จ!'); 
    
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการบันทึก:', error);
    alert('เกิดข้อผิดพลาดในการบันทึก! กรุณาลองใหม่');
  } finally {
    loading.value = false;
  }
};

/**
 * @description สลับสถานะการมอบหมายเมื่อคลิกที่ Checkbox ใน Dialog
 * @param {string} appraiseeId - ID ของผู้รับการประเมิน
 */
const toggleAssignment = (appraiseeId) => {
  const index = assignedAppraiseeIds.value.indexOf(appraiseeId);
  if (index === -1) {
    // เพิ่มการมอบหมาย
    assignedAppraiseeIds.value.push(appraiseeId);
  } else {
    // ลบการมอบหมาย
    assignedAppraiseeIds.value.splice(index, 1);
  }
};

// ------------------------------------------
// 5. LIFECYCLE HOOK
// ------------------------------------------
onMounted(async () => {
  loading.value = true;
  const data = await loadInitialData();
  appraisers.value = data.appraisers;
  appraisees.value = data.appraisees;
  loading.value = false;
});
</script>

<template>
  <v-app>
    <v-container fluid class="pa-6">
      <v-card class="pa-6 elevation-4">
        
        <h1 class="text-h5 mb-4 text-primary">กำหนดผู้ประเมิน (Appraiser)</h1>
        <p class="text-subtitle-1 text-medium-emphasis mb-6">
          โปรดเลือกผู้ประเมินจากตารางด้านล่าง และกำหนดรายชื่อผู้รับการประเมินที่ต้องการมอบหมาย
        </p>

        <!-- ตารางผู้ประเมินหลัก -->
        <v-data-table
          :headers="appraiserHeaders"
          :items="appraisers"
          :loading="loading"
          item-key="id"
          class="elevation-2 rounded-lg"
          no-data-text="ไม่พบข้อมูลผู้ประเมิน"
        >
          <!-- Custom Slot สำหรับแสดงจำนวนผู้ที่ถูกมอบหมาย -->
          <template v-slot:item.assigned_count="{ item }">
            <v-chip 
              :color="item.assigned_count > 0 ? 'success' : 'grey'" 
              variant="flat"
              size="small"
              label
            >
              {{ item.assigned_count }} คน
            </v-chip>
          </template>

          <!-- Custom Slot สำหรับปุ่ม Action -->
          <template v-slot:item.actions="{ item }">
            <v-btn 
              color="info" 
              variant="flat" 
              size="small" 
              @click="openAssignmentDialog(item)"
              append-icon="mdi-pencil-box-multiple-outline"
            >
              จัดการการมอบหมาย
            </v-btn>
          </template>
        </v-data-table>

      </v-card>

      <!-- Dialog สำหรับจัดการการมอบหมาย -->
      <v-dialog 
        v-model="assignmentDialog" 
        max-width="800"
        persistent
      >
        <v-card v-if="selectedAppraiser" class="rounded-xl">
          <v-card-title class="bg-primary text-white">
            <span class="text-h6">
              มอบหมายผู้รับการประเมิน: {{ selectedAppraiser.name }}
            </span>
          </v-card-title>

          <v-card-text class="pt-4">
            <v-alert 
              type="info" 
              variant="tonal" 
              density="compact" 
              class="mb-4"
              icon="mdi-information-outline"
            >
              เลือกผู้รับการประเมินที่ต้องการมอบหมายให้ **{{ selectedAppraiser.name }}** เป็นผู้ประเมิน
            </v-alert>

            <!-- รายการผู้รับการประเมินสำหรับเลือก -->
            <v-list lines="two" subheader>
              <v-list-item
                v-for="item in appraiseesWithAssignmentStatus"
                :key="item.id"
                :value="item.id"
                :title="item.name"
                :subtitle="`รหัส: ${item.id} | แผนก: ${item.department}`"
                @click="toggleAssignment(item.id)"
                :class="{ 'bg-blue-lighten-5': item.assigned }"
                rounded
                class="my-1"
              >
                <template v-slot:append>
                  <v-checkbox-btn 
                    :model-value="item.assigned"
                    color="success"
                  ></v-checkbox-btn>
                </template>
              </v-list-item>
            </v-list>

          </v-card-text>

          <v-card-actions class="pa-4 bg-grey-lighten-5">
            <v-spacer></v-spacer>
            <v-btn 
              color="grey-darken-1" 
              variant="text" 
              @click="assignmentDialog = false"
              :disabled="loading"
            >
              ยกเลิก
            </v-btn>
            <v-btn 
              color="success" 
              variant="flat" 
              @click="confirmAssignment"
              :loading="loading"
            >
              บันทึกการมอบหมาย ({{ assignedAppraiseeIds.length }} คน)
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>
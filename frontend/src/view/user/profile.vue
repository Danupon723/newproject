<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="mx-auto pa-4" elevation="3">
          <div class="text-center">
            <v-avatar size="100" color="grey-lighten-2" class="elevation-2">
              <v-img :src="user.avatarUrl" alt="Profile"></v-img>
            </v-avatar>
            
            <div class="text-h6 mt-3">{{ user.name }}</div>
            <div class="text-subtitle-1 text-medium-emphasis">{{ user.role }}</div>
          </div>

          <v-divider class="my-4"></v-divider>

          <v-list density="compact" class="py-0">
            <v-list-item 
              prepend-icon="mdi-email" 
              :title="user.email" 
              subtitle="อีเมล"
            ></v-list-item>
            <v-list-item 
              prepend-icon="mdi-phone" 
              :title="user.phone" 
              subtitle="เบอร์โทรศัพท์"
            ></v-list-item>
            <v-list-item 
              prepend-icon="mdi-map-marker" 
              :title="user.location" 
              subtitle="ที่ตั้ง"
            ></v-list-item>
          </v-list>

          <v-divider class="my-4"></v-divider>

          <v-card-actions>
            <v-btn 
              block 
              color="primary" 
              variant="flat"
              @click="handleEdit"
            >
              แก้ไขข้อมูลส่วนตัว
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

// ข้อมูลจำลองที่ดึงมาจากฐานข้อมูล
const user = ref({
  name: 'สุดใจ มั่นคง',
  role: 'พนักงานทั่วไป',
  email: 'sudjai@company.com',
  phone: '090-000-1111',
  location: 'กรุงเทพมหานคร',
  avatarUrl: 'https://i.pravatar.cc/300?img=50'
});

// ฟังก์ชันสำหรับปุ่มแก้ไข (สามารถเปลี่ยนเป็นการเปิด Modal ได้)
const handleEdit = () => {
  alert('เปิดหน้าแก้ไขข้อมูล...');
  // ในการใช้งานจริง: router.push('/profile/edit') หรือ isEditDialog.value = true
};


</script>
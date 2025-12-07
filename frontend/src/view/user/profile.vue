<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="mx-auto pa-4" elevation="3">
          <div class="text-center">
            <v-avatar size="100" color="grey-lighten-2" class="elevation-2">
              <v-img :src="user.avatarUrl || defaultAvatar" alt="Profile"></v-img>
            </v-avatar>

            <div class="text-h6 mt-3">{{ user.name }}</div>
            <div class="text-subtitle-1 text-medium-emphasis">{{ user.role }}</div>
          </div>

          <v-divider class="my-4"></v-divider>

          <v-list density="compact" class="py-0">
            <v-list-item 
              prepend-icon="mdi-email" 
              :title="user.email" 
            ></v-list-item>
            <v-list-item 
              :title="user.department || '-'"
            ></v-list-item>
            <v-list-item 
              :title="user.group || '-'"
            ></v-list-item>
          </v-list>

          <v-divider class="my-4"></v-divider>

          <v-card-actions>
            <v-btn block color="primary" variant="flat" @click="handleEdit">
              แก้ไขข้อมูลส่วนตัว
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// ข้อมูล user เริ่มต้น
const user = ref({
  name: '',
  role: '',
  email: '',
  department: '',
  group: '',
  avatarUrl: null
});

// รูป default ถ้า user ไม่มี avatar
const defaultAvatar = '/images/default-avatar.png'; // เปลี่ยนเป็น path ที่คุณใช้

// ปุ่มแก้ไข
const handleEdit = () => {
  router.push('/user/Editprofile'); // หรือเปิด Dialog แก้ไขข้อมูล
};

// โหลดข้อมูลผู้ใช้จาก API
const loadUser = async () => {
  try {
    const token = localStorage.getItem('token');
    const headers = { Authorization: 'Bearer ' + token };

    const res = await axios.get('http://localhost:7000/api/evaluatee/profile', { headers });
    console.log(res.data)
    console.log(res.data.item)
    const data = res.data.item
    user.value = {
      name: data.name || '',
      role: data.role || '',
      email: data.email || '',
      department: data.deprmt_name || '',
      group: data.group_name || '',
      avatarUrl: data.avatarUrl || null
    };
  } catch (err) {
    console.error('โหลดข้อมูลผู้ใช้ไม่สำเร็จ', err);
  }
};

onMounted(() => {
  loadUser();
});
</script>

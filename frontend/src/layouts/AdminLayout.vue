<template>
  <v-app>
    <!-- Sidebar -->
    <v-navigation-drawer app permanent>
      <v-list>
        <v-list-item link to="/admin/dashboard">
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/admin/users">
          <v-list-item-title>Users</v-list-item-title>
        </v-list-item>
        <!-- เพิ่มลิงก์อื่น ๆ -->
      </v-list>
    </v-navigation-drawer>

    <!-- Navbar -->
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Admin Panel</v-toolbar-title>
    </v-app-bar>

    <!-- เนื้อหาหลัก -->
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup>
// ไม่มี state พิเศษตอนนี้
</script>

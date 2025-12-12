<template>
  <v-container class="d-flex justify-center align-center" style="height: 80vh;">
    <v-card width="520" class="pa-6">
      <h2 class="text-center mb-6">ประเมินผู้รับการประเมิน</h2>

      <!-- เลือกหัวข้อประเมิน -->
      <v-select
        v-model="maintopic"
        :items="maintopic"
        item-title="name"
        item-value="id"
        label="เลือกหัวข้อประเมิน"
        dense
        @change="loadSubTopics"
      ></v-select>

      <!-- เลือกหัวข้อย่อย -->
      <v-select
        v-model="selectedSub"
        :items="subTopicList"
        item-title="name"
        item-value="id"
        label="เลือกหัวข้อย่อย"
        dense
        :disabled="!selectedTopic"
      ></v-select>

      <!-- เลือกชื่อผู้รับการประเมิน -->
      <v-select
        v-model="selectedUser"
        :items="userList"
        item-title="fullName"
        item-value="id"
        label="เลือกผู้รับการประเมิน"
        dense
      ></v-select>

      <!-- Dropdown เลือก มี/ไม่มี -->
      <v-select
        v-model="hasOption"
        :items="yesNoOptions"
        label="เลือกมี/ไม่มี"
        dense
      ></v-select>

      <!-- Dropdown เลือก 1-4 -->
      <v-select
        v-if="hasOption === true"
        v-model="selectedNumber"
        :items="[1,2,3,4]"
        label="เลือกตัวเลข"
        dense
        color="primary"
      ></v-select>

      <v-select
        v-else
        :items="[1,2,3,4]"
        label="เลือกตัวเลข"
        dense
        disabled
        class="grey lighten-2"
      ></v-select>
    </v-card>
  </v-container>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      /* Dropdown มี/ไม่มี */
      hasOption: null,
      selectedNumber: null,
      yesNoOptions: [
        { text: "มี", value: true },
        { text: "ไม่มี", value: false },
      ],

      /* Topic */
      topicList: [],
      selectedTopic: null,

      /* Sub Topic */
      subTopicList: [],
      selectedSub: null,

      /* User List */
      userList: [],
      selectedUser: null,
    };
  },

  created() {
    this.loadTopics();
    this.loadUsers();
  },

  methods: {
    /* โหลดหัวข้อ */
    async loadTopics() {
      try {
        const res = await axios.get("http://localhost:7000/api/admin/topiclist");
         this.topicList = res.data.map(item => item.topicName);
      } catch (e) {
        console.error("โหลดหัวข้อไม่สำเร็จ", e);
      }
    },

    /* โหลดหัวข้อย่อยเมื่อเลือกหัวข้อ */
    async loadSubTopics() {
      if (!this.selectedTopic) return;

      try {
        const res = await axios.get(
          `http://localhost:7000/api/subtopics/${this.selectedTopic}`
        );
        this.subTopicList = res.data;
      } catch (e) {
        console.error("โหลดหัวข้อย่อยไม่สำเร็จ", e);
      }
    },

    /* โหลดรายชื่อผู้รับการประเมิน */
    async loadUsers() {
      try {
        const res = await axios.get("http://localhost:7000/api/admin/userslist");
        this.userList = res.data;
      } catch (e) {
        console.error("โหลดรายชื่อไม่สำเร็จ", e);
      }
    },
  },
};
</script>

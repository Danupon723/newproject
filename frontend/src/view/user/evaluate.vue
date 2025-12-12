<template>
  <v-container>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="topics"
        :loading="loading"
        item-key="id"
      >
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title>รายการหัวข้อการประเมินหลัก</v-toolbar-title>
          </v-toolbar>
        </template>

        <template #item.actions="{ item }">
          <v-btn
            color="info"
            size="small"
            prepend-icon="mdi-chart-line"
            @click="editTopic(item)"
          >
            ดูความคืบหน้า
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Popup -->
    <v-dialog v-model="dialogAdd" max-width="600">
      <v-card class="pa-6">

        <h2 class="text-h5 mb-4">
          <p class="text-h6">หัวข้อที่เลือก: {{ selectedTopicName }}</p>
          ปี พ.ศ. {{ form.buddhist_year || buddhist_year }}
        </h2>

        <v-form @submit.prevent="saveTopic">

          <v-select
            v-model="selectedIndicator"
            :items="indicatorList"
            item-title="name"
            item-value="id"
            label="เลือกตัวชี้วัด"
            dense
          />

          <v-select
            v-model="selectedTopic"
            :items="topics"
            item-title="name"
            item-value="id"
            label="เลือกหัวข้อประเมิน"
            dense
            @update:modelValue="updateSelectedTopicName"
          />

          <v-select
            v-model="selectedSub"
            :items="subTopicList"
            item-title="name"
            item-value="id"
            label="เลือกหัวข้อย่อย"
            dense
          />

          <v-select
            v-model="hasOption"
            :items="yesNoOptions"
            item-title="text"
            item-value="value"
            label="เลือกมี/ไม่มี"
            dense
          />

          <v-select
            v-model="selectedNumber"
            :items="[1, 2, 3, 4]"
            label="เลือกตัวเลข"
            dense
            :disabled="!hasOption"
          />

          <v-file-input label="File input" variant="outlined" />
          <v-text-field label="ใส่ URL" v-model="URL" variant="outlined" class="mb-3" />

          <v-card-actions class="mt-4">
            <v-spacer />
            <v-btn text @click="dialogAdd = false">ยกเลิก</v-btn>
            <v-btn color="primary" type="submit">บันทึก</v-btn>
          </v-card-actions>

        </v-form>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// State
const topics = ref([]);
const indicatorList = ref([]);
const subTopicList = ref([]);

const selectedTopic = ref(null);
const selectedTopicName = ref("");
const selectedIndicator = ref(null);
const selectedSub = ref(null);

const hasOption = ref(null);
const selectedNumber = ref(null);
const URL = ref("");

const loading = ref(false);
const dialogAdd = ref(false);

// ฟอร์มปี พ.ศ.
const buddhist_year = new Date().getFullYear() + 543;
const form = ref({ id: null, buddhist_year: "" });

// yes/no
const yesNoOptions = [
  { text: "มี", value: true },
  { text: "ไม่มี", value: false },
];

// ตาราง header
const headers = [
  { title: "ลำดับ", key: "id" },
  { title: "หัวข้อการประเมิน", key: "name" },
  { title: "ปีที่เริ่ม", key: "buddhist_year" },
  { title: "วันที่เริ่ม", key: "start_date" },
  { title: "วันที่จบ", key: "end_date" },
  { title: "สถานะ", key: "active" },
  { title: "จัดการ", key: "actions", sortable: false },
];

// API Helper
const api = async (url) => {
  try {
    return (await axios.get(url)).data;
  } catch (e) {
    console.error(e);
    return [];
  }
};

// โหลดข้อมูล
const fetchTopics = async () => {
  loading.value = true;
  const res = await api("http://localhost:7000/api/admin/periodslist");
  topics.value = res.periods || res || [];
  loading.value = false;
};

const loadIndicators = async () => {
  const res = await api("http://localhost:7000/api/admin/indicatorslist");
  indicatorList.value = res.indicators || res || [];
};

const loadSubTopics = async () => {
  const res = await api("http://localhost:7000/api/admin/topiclist");
  subTopicList.value = res.topiclist || res || [];
};

// ตั้งชื่อหัวข้อ
const updateSelectedTopicName = () => {
  selectedTopicName.value =
    topics.value.find((t) => t.id === selectedTopic.value)?.name || "";
};

// บันทึก
const saveTopic = async () => {
  try {
    await axios.post("http://localhost:7000/api/admin/createEvaluate", {
      topic_id: selectedTopic.value,
      subtopic_id: selectedSub.value,
      indicator_id: selectedIndicator.value,
      hasOption: hasOption.value,
      numberValue: selectedNumber.value,
      URL: URL.value,
    });

    alert("บันทึกสำเร็จ");
    dialogAdd.value = false;

  } catch (err) {
    console.error(err);
    alert("บันทึกไม่สำเร็จ");
  }
};

// Edit popup
const editTopic = (item) => {
  form.value = {
    id: item.id,
    buddhist_year: item.buddhist_year,
  };

  selectedTopic.value = item.id;
  selectedTopicName.value = item.name;
  loadIndicators();
  loadSubTopics();

  dialogAdd.value = true;
};

// Init
onMounted(() => {
  fetchTopics();
  loadIndicators();
});
</script>

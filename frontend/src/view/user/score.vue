<template>
  <div v-for="i in list" :key="i.id">
    {{ i.name }}
    <input type="number" v-model="i.score" />
    <textarea v-model="i.comment"></textarea>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const list = ref([])
const URL = 'http://localhost:7000/api/evaluation'

onMounted(async()=>{
  list.value = (await axios.get(URL)).data
})

const save = async()=>{
  await axios.post(URL, list.value)
}
</script>

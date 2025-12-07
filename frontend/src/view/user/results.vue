<template>
  <ul>
    <li v-for="s in sum" :key="s.id">{{ s.name }} : {{ s.score }}</li>
  </ul>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const sum = ref([])
onMounted(async()=>{
  sum.value = (await axios.get('http://localhost:7000/api/summary')).data
})
</script>

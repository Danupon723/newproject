<template>
  <div>
    <canvas ref="pad" width="300" height="120"
      @mousedown="start" @mousemove="draw" @mouseup="end"
      style="border:1px solid"></canvas>
    <button @click="submit">ยืนยันส่งผล</button>
  </div>
</template>

<script setup>
import { ref,onMounted } from 'vue'
import axios from 'axios'

const pad = ref(null)
const ctx = ref(null)
let drawOn = false

onMounted(()=>ctx.value = pad.value.getContext('2d'))

const start=e=>{drawOn=true;ctx.value.moveTo(e.offsetX,e.offsetY)}
const draw=e=>{if(drawOn){ctx.value.lineTo(e.offsetX,e.offsetY);ctx.value.stroke()}}
const end=()=>drawOn=false

const submit=async()=>{
  await axios.post('http://localhost:7000/api/submit',{
    sign: pad.value.toDataURL()
  })
}
</script>

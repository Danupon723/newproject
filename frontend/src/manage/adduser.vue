<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card width="450" class="pa-6">
      <v-card-title class="text-h5 text-center mb-4">
        📝 เพิ่มข้อมูลผู้ใช้
      </v-card-title>

  <v-form>

    <v-text-field
      label="อีเมล"
      v-model="email"
      type="email"
      variant="outlined"
      class="mb-3"
      prepend-inner-icon="mdi-email"
    />
    <v-text-field
      label="รหัสผ่าน"
      v-model="password"
      type="password"
      variant="outlined"
      class="mb-3"
      prepend-inner-icon="mdi-lock"
    />
      <v-text-field
      label="ชื่อผู้ใช้"
      v-model="name"
      variant="outlined"
      class="mb-3"
      prepend-inner-icon="mdi-account"
    />
    <v-select
      v-model="department_id"
      :items="department"
        item-title="name"
         item-value="id"
      label="เเผนก"
      variant="outlined"
    ></v-select>
    <v-select
      v-model="group_id"
      :items="group"
        item-title="name"
        item-value="id"
      label="กลุ่ม"
      variant="outlined"
    ></v-select>
    

    <v-btn
      color="primary"
      block
      @click="handleRegister"
    >
      เพิ่มผู้ใช้
    </v-btn>
  </v-form>
</v-card>

  </v-container>
</template>

<script setup>
import { ref , onMounted } from "vue";
import axios  from "axios";
import { useRouter } from "vue-router";

const router = useRouter()

const email = ref("");
const password = ref("");
const name = ref("");
const department_id = ref("")
const group_id = ref("")

 const department = ref([])

   const group = ref([])

  

async function loaddata() {
    try{
        const loaddata = await axios.get('http://localhost:7000/api/admin/dept')
        console.log(loaddata)
      department.value = loaddata.data
        const loadgruop = await axios.get('http://localhost:7000/api/admin/grop')
        console.log(loadgruop.data)
        group.value = loadgruop.data
    }catch(e){
        console.log(e)
    }
}

async function handleRegister() {
  console.log("register:", name.value, email.value, password.value,department_id.value , group_id.value);
  const pay = {
    name : name.value,
    email : email.value,
    password : password.value,
    department_id : department_id.value,
    group_id : group_id.value,
  }
  try{
    const respone = await axios.post('http://localhost:7000/api/auth/register' , pay)
    console.log(respone.data);
    if (respone.data.success){
      router.push('users')
    }else{
      alert('ไม่สำเร็จ')
    }
  }catch(e){
    console.log(e)
  }


}


onMounted( ()=>{
  loaddata()
})
</script>

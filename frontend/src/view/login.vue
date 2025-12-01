<template>
  <v-container class="login-page d-flex justify-center align-center" style="height: 100vh;">
    <v-card width="420" class="pa-6">
      <v-card-title class="text-h5 text-center mb-4">
        🔐 Login
      </v-card-title>


  <v-form>
    <v-text-field
      label="Email"
      v-model="email"
      type="email"
      variant="outlined"
      class="mb-3"
      prepend-inner-icon="mdi-email"
      autocomplete="current-password"
    />

    <v-text-field
      label="Password"
      v-model="password"
      type="password"
      variant="outlined"
      class="mb-3"
      prepend-inner-icon="mdi-lock"
      autocomplete="current-password"
    />

    <v-btn
      color="primary"
      class="mt-2"
      block
      @click="handleLogin"
    >
      Login
    </v-btn>

    <div class="text-center mt-4">
      <RouterLink to="/register">Create a new account</RouterLink>
    </div>
  </v-form>
</v-card>


  </v-container>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter  } from "vue-router" ; 

const router = useRouter ()
const email = ref("");
const password = ref("");



 async function handleLogin() {
  console.log("login:", email.value, password.value);
const payload = {
  email : email.value,
  password : password.value,
}

  try{
    const repone = await axios.post('http://localhost:7000/api/auth/login',payload)
    console.log('data' ,repone.data);
    const res = repone.data
    console.log(localStorage.getItem('token'))
    if(res.success){
      localStorage.setItem('token' , res.token)
            if(res.role === 'admin'){
            router.push('/admin');
          }if(res.role === 'evaluator'){  
          router.push('/user');
          }if(res.role === 'evaluayee'){
            router.push('/Assessor')
          }
    }else{
      alert('ไม่พบ')
    }
   

  }catch(e){
    console.log(e)
  }
}

</script>

<style>

</style>


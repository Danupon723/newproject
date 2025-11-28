<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card width="450" class="pa-6">
      <v-card-title class="text-h5 text-center mb-4">
        📝 Register
      </v-card-title>

  <v-form>
    <v-text-field
      label="Full Name"
      v-model="name"
      variant="outlined"
      class="mb-3"
      prepend-inner-icon="mdi-account"
    />

    <v-text-field
      label="Email"
      v-model="email"
      type="email"
      variant="outlined"
      class="mb-3"
      prepend-inner-icon="mdi-email"
    />

    <v-text-field
      label="Password"
      v-model="password"
      type="password"
      variant="outlined"
      class="mb-3"
      prepend-inner-icon="mdi-lock"
    />

    <v-text-field
      label="Confirm Password"
      v-model="confirmPassword"
      type="password"
      variant="outlined"
      class="mb-3"
      prepend-inner-icon="mdi-lock-check"
    />

    <v-btn
      color="primary"
      block
      @click="handleRegister"
    >
      Register
    </v-btn>

    <div class="text-center mt-4">
      <RouterLink to="/">Already have an account?</RouterLink>
    </div>
  </v-form>
</v-card>

  </v-container>
</template>

<script setup>
import { ref } from "vue";
import axios  from "axios";

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

async function handleRegister() {
  console.log("register:", name.value, email.value, password.value);
//   const payload = {
//     name : name.value , 
//     email : email.value , 
//     password : password.value ,
//   }
//   try{
//   const reponse = await axios.post('http://localhost:7000/api/auth/register' , payload )
//     console.log('data', response.data);
//     alert("Registration successful!");
//   }catch(e){
//     console.log(e)
//   }


}
</script>

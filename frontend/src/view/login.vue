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
    />

    <v-text-field
      label="Password"
      v-model="password"
      type="password"
      variant="outlined"
      class="mb-3"
      prepend-inner-icon="mdi-lock"
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
import { ref } from "vue";

const email = ref("");
const password = ref("");

function handleLogin() {
  console.log("login:", email.value, password.value);
}
</script>

<style>

</style>


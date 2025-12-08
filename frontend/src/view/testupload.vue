<template>
  <div class="upload-container">
    <h1>Upload File</h1>

    <form @submit.prevent="uploadFile">
      <input type="file" @change="handleFile" />
      <button type="submit">Upload</button>
    </form>

    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      file: null,
      message: ""
    };
  },
  methods: {
    handleFile(e) {
      this.file = e.target.files[0];
    },

    async uploadFile() {
      if (!this.file) {
        this.message = "กรุณาเลือกไฟล์ก่อน";
        return;
      }

      const formData = new FormData();
      formData.append("photo", this.file);
      const token = localStorage.getItem('token')
      try {
        const res = await axios.post(
          "http://localhost:7000/api/upload/evaluatee",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
               "Authorization": `Bearer ${token}`
            },
          }
        );

        this.message = "อัปโหลดสำเร็จ ✅";
        console.log(res.data);
      } catch (err) {
        this.message = "อัปโหลดไม่สำเร็จ ❌";
        console.error(err);
      }
    }
  }
};
</script>

<style scoped>
.upload-container {
  max-width: 400px;
  margin: 50px auto;
  text-align: center;
}
</style>

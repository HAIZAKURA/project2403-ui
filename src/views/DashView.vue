<template>
  <div id="dash">
    <div class="title">
      <span v-if="user.role == 1" class="title-text">欢迎，管理员 {{ user.username }}</span>
      <span v-else class="title-text">欢迎，用户 {{ user.username }}</span>
    </div>
  </div>

  <el-divider></el-divider>

  <el-row :gutter="20">
    <el-col :span="12">
      <el-divider>云盒警报</el-divider>
    </el-col>
    <el-col :span="12">
      <el-divider>漏电保护警报</el-divider>
    </el-col>
  </el-row>
</template>

<script setup>
import {  reactive } from 'vue'

const user = reactive({
  uid: localStorage.getItem('uid'),
  role: localStorage.getItem('role'),
  username: localStorage.getItem('username')
})
</script>

<style>
.blank1 {
  height: 1em;
}

.title {
  text-align: left;
}

.title-text {
  font-size: 1.5rem;
}
</style>

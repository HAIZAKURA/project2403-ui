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
      <div id="alert-box">
        <el-button type="primary" v-for="item in regionList" :key="item.region_id">{{
          item.region_name
        }}</el-button>
        <el-divider />
      </div>
    </el-col>
    <el-col :span="12">
      <el-divider>漏电保护警报</el-divider>
      <div id="alert-box">
        <el-button type="primary" plain v-for="item in regionList" :key="item.region_id">{{
          item.region_name
        }}</el-button>
        <el-divider />
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getUser } from '@/api/user'

const regionList = ref([])

const user = reactive({
  uid: localStorage.getItem('uid'),
  role: localStorage.getItem('role'),
  username: localStorage.getItem('username')
})

const getRegionList = () => {
  getUser(localStorage.getItem('uid'))
    .then((res) => {
      if (res.data.code == 200) {
        regionList.value = res.data.data.Regions
      } else {
        ElMessage.error('获取用户信息失败')
      }
    })
    .catch((err) => {
      ElMessage.error(err.message)
    })
}

onMounted(() => {
  getRegionList()
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

#alert-box {
  padding: 0.5rem 1rem;
}
</style>

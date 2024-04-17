<template>
  <!-- 登录容器，使用 Element UI 的布局组件 -->
  <el-container id="login-container">
    <el-main id="login-main">
      <!-- 登录主体内容 -->
      <div id="login">
        <!-- 使用 Element UI 的栅格系统居中显示登录表单 -->
        <el-row justify="center">
          <el-col :xs="16" :sm="14" :md="10" :lg="6" :xl="4">
            <!-- logo 显示 -->
            <div id="logo">
              <img src="../assets/logo.svg" alt="logo" class="logo" />
            </div>
            <!-- 登录卡片容器 -->
            <el-card id="login-card">
              <!-- 卡片头部，显示登录标题 -->
              <template v-slot:header>
                <div class="has-text-centered card-title">
                  <span>用户登录</span>
                </div>
              </template>
              <!-- 登录表单，使用 Element UI 的表单组件 -->
              <el-form :model="form" label-width="auto" label-position="left">
                <!-- 表单项：用户名输入 -->
                <el-form-item label="用户名">
                  <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <!-- 表单项：密码输入 -->
                <el-form-item label="密码">
                  <el-input
                    v-model="form.password"
                    placeholder="请输入密码"
                    type="password"
                    show-password
                  ></el-input>
                </el-form-item>
                <!-- 登录按钮，点击触发 onSubmit 事件 -->
                <el-form-item>
                  <el-button type="primary" class="button-center" size="large" @click="onSubmit">登 录</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-main>
  </el-container>
  <Vcode :show="isShow" @success="onSuccess" @close="onClose" />
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { userLogin } from '@/api/user'
import { ElMessage } from 'element-plus'
import Vcode from 'vue3-puzzle-vcode'
import { useRouter } from 'vue-router'

const router = useRouter()

const isShow = ref(false)

const onShow = () => {
  isShow.value = true
}

const onClose = () => {
  isShow.value = false
}

const onSuccess = () => {
  onClose()
  userLogin(form)
    .then((res) => {
      if (res.data.code == 200) {
        ElMessage.success('登录成功')
        localStorage.setItem('uid', res.data.data.uid)
        localStorage.setItem('role', res.data.data.role)
        localStorage.setItem('username', res.data.data.username)
        localStorage.setItem('token', res.data.token)
        router.push('/')
      } else if (res.data.code == 401) {
        ElMessage.error('用户名或密码错误')
      } else {
        ElMessage.error('未知错误')
      }
    })
    .catch((err) => {
      ElMessage.error('Error:', err)
    })
}

const form = reactive({
  username: '',
  password: ''
})

const onSubmit = () => {
  onShow()
}
</script>

<style>
.logo {
  max-height: 5rem;
  margin: 2.5rem auto;
  display: block;
}

.card-title {
  height: 3rem;
  span {
    font-size: 1.5rem;
    line-height: 3rem;
  }
}
</style>

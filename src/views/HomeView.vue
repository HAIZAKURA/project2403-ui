<template>
  <div class="home">
    <el-container>
      <el-aside width="12em" class="aside">
        <el-menu
          mode="vertical"
          router
          unique-opened
          :default-active="activePath"
          class="aside-menu"
          background-color="#242327"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <div class="aside-logo">
            <img class="logo" src="../assets/logo.svg" alt="logo" />
          </div>
          <el-menu-item class="aside-menu-item" index="/">
            <el-icon><Odometer /></el-icon>
            <span>首 页</span>
          </el-menu-item>
          <el-menu-item v-if="user.role == 1" class="aside-menu-item" index="/user">
            <el-icon><User /></el-icon>
            <span>用 户</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="header" height="4em">
          <div class="header-tool"></div>
        </el-header>
        <el-main class="main-view">
          <RouterView />
        </el-main>
        <el-footer height="2em" class="footer">
          <span class="footer-text">Footer</span>
        </el-footer>
      </el-container>
    </el-container>
    <div class="header-menu">
      <div class="header-menu-item">
        <span class="header-menu-item-user">{{ user.username }}</span>
        <el-button class="header-menu-item-button" @click="myDialogVisible = true" circle><el-icon><Key /></el-icon></el-button>
        <el-button class="header-menu-item-button" type="danger" @click="onLogout">登出</el-button>
      </div>
    </div>
  </div>

  <el-dialog v-model="myDialogVisible" :before-close="onMyDialogClose" title="修改密码" width="30%">
    <el-form :model="renewPassForm" label-width="80px" label-position="left">
      <el-form-item label="旧密码">
        <el-input v-model="renewPassForm.password" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="新密码">
        <el-input v-model="renewPassForm.new_password" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onRenewPass">确认</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

</template>

<script setup>
import { RouterView } from 'vue-router'
import { onMounted, reactive, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { refreshToken, renewPass } from '@/api/user'
import { ElMessage } from 'element-plus'

const myDialogVisible = ref(false)

const renewPassForm = reactive({
  password: '',
  new_password: ''
})

const user = reactive({
  uid: localStorage.getItem('uid'),
  role: localStorage.getItem('role'),
  username: localStorage.getItem('username'),
})

const router = useRouter()

router.beforeEach((to, from, next) => {
  sessionStorage.setItem('activePath', to.path)
  next();
});

const activePath = computed(() => {
  return sessionStorage.getItem('activePath') || '/'
})

/**
 * 登出功能实现。
 * 清除本地存储并重定向到登录页。
 */
const onLogout = () => {
  ElMessage.success('登出成功')
  localStorage.clear() // 清除本地存储
  router.push('/login') // 重定向到登录页
}

/**
 * 重置密码功能实现。
 * 根据用户ID和新密码表单数据提交密码重置请求。
 */
const onRenewPass = () => {
  console.log(user.uid, renewPassForm)
  renewPass(user.uid, renewPassForm) // 提交密码重置请求
    .then((res) => {
      if (res.data.code == 200) { // 密码重置成功
        ElMessage.success('密码重置成功')
        localStorage.clear() // 清除本地存储
        router.push('/login') // 重定向到登录页
      } else { // 密码重置失败
        ElMessage.error('密码重置失败')
      }
    })
    .catch((err) => {
      ElMessage.error('Error:', err) // 处理请求错误
    })
}

/**
 * 对话框关闭时的处理逻辑。
 * 重置密码表单数据并隐藏对话框。
 */
const onMyDialogClose = () => {
  renewPassForm.password = '' // 重置密码字段
  renewPassForm.new_password = '' // 重置新密码字段
  myDialogVisible.value = false // 隐藏对话框
}

/**
 * 刷新JWT Token。
 * 请求新的JWT Token并更新本地存储。
 */
const refreshJWT = () => {
  refreshToken() // 请求新的JWT Token
    .then((res) => {
      if (res.data.code == 200) { // Token刷新成功
        localStorage.setItem('uid', res.data.data.uid) // 存储用户ID
        localStorage.setItem('role', res.data.data.role) // 存储用户角色
        localStorage.setItem('username', res.data.data.username) // 存储用户名
        localStorage.setItem('token', res.data.token) // 存储Token
      } else if (res.data.code == 401) { // 用户未登录
        ElMessage.error('用户未登录')
        localStorage.clear() // 清除本地存储
        router.push('/login') // 重定向到登录页
      } else { // 未知错误
        ElMessage.error('未知错误')
        localStorage.clear() // 清除本地存储
        router.push('/login') // 重定向到登录页
      }
    })
    .catch((err) => {
      ElMessage.error('Error:', err) // 处理请求错误
    })
}

onMounted(() => {
  refreshJWT()
})
</script>

<style>
.blank1 {
  height: 1em;
}

.aside {
  max-width: 12em;
  height: 100%;
  overflow-x: hidden;
  z-index: 1;
}

.aside-menu {
  height: 100vh;
  border-right: none;
}

.el-menu-item.is-active {
  background-color: #393a3e !important;
}

.aside-menu-item {
  text-align: left;
}

.aside-submenu-item {
  text-align: center;
}

.aside-logo {
  max-width: 12em;
  display: grid;
}

.logo {
  width: 5em;
  margin: auto;
}

.main-view {
  margin-top: 4.5em;
  padding: 2em;
}

.header {
  width: 100%;
  padding: 0;
}

.header-tool {
  background-color: #242327;
  height: 4em;
}

.header-menu {
  height: 4.5em;
  line-height: 4.5em;
  position: absolute;
  top: 0;
  right: 1em;
  z-index: 999;
}

.header-menu-item-user {
  height: 4.5em;
  line-height: 4.5em;
  font-weight: bold;
  color: #fff;
}

.header-menu-item-button {
  line-height: 4.5em;
  margin-left: 1em;
}

.footer {
  text-align: center;
}

.footer-text {
  color: #909399;
  height: 2em;
  line-height: 2em;
}
</style>

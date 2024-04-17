<template>
  <div class="home">
    <el-container>
      <el-aside width="12em" class="aside">
        <el-menu
          mode="vertical"
          router
          unique-opened
          :default-active="defaultActive"
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
        <el-button class="header-menu-item-button"
          ><el-icon><Avatar /></el-icon
        ></el-button>
        <el-button class="header-menu-item-button" type="danger" @click="onLogout">登出</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { refreshToken } from '@/api/user'
import { ElMessage } from 'element-plus'

const user = reactive({
  uid: localStorage.getItem('uid'),
  role: localStorage.getItem('role'),
  username: localStorage.getItem('username'),
})

const router = useRouter()

const defaultActive = computed(() => router.path)

const onLogout = () => {
  ElMessage.success('登出成功')
  localStorage.clear()
  router.push('/login')
}

const refreshJWT = () => {
  refreshToken()
    .then((res) => {
      if (res.data.code == 200) {
        localStorage.setItem('uid', res.data.data.uid)
        localStorage.setItem('role', res.data.data.role)
        localStorage.setItem('username', res.data.data.username)
        localStorage.setItem('token', res.data.token)
      } else if (res.data.code == 401) {
        ElMessage.error('用户未登录')
        localStorage.clear()
        router.push('/login')
      } else {
        ElMessage.error('未知错误')
        localStorage.clear()
        router.push('/login')
      }
    })
    .catch((err) => {
      ElMessage.error('Error:', err)
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

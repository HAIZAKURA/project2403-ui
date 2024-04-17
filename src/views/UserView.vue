<template>
  <div id="user">
    <div class="title">
      <span class="title-text">用&nbsp;户&nbsp;管&nbsp;理</span>
    </div>

    <el-divider></el-divider>

    <div class="user">
      <el-row :gutter="20">
        <el-col :span="15">
          <el-input v-model="searchQuery" @input="fliterData" placeholder="请输入用户名" />
          <div class="blank1"></div>
          <el-table :data="filteredData" border stripe max-height="300" style="width: 100%">
            <el-table-column prop="uid" label="用户ID" />
            <el-table-column prop="username" label="用户名" />
            <el-table-column label="用户组">
              <template #default="scope">
                <el-tag v-if="scope.row.role == 1" type="danger">管理员</el-tag>
                <el-tag v-else>普通用户</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template #default="scope">
                <el-tag v-if="scope.row.active == 1" type="success">正常</el-tag>
                <el-tag v-else type="danger">禁用</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="primary" size="small" @click="handleClick">详细</el-button>
                <el-popconfirm
                  v-if="scope.row.active == 1"
                  :icon="WarningFilled"
                  icon-color="#F56C6C"
                  title="确定要禁用该账户吗？"
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  @confirm="onDeleteUser(scope.row.uid)"
                >
                  <template #reference>
                    <el-button type="danger" size="small">禁用</el-button>
                  </template>
                </el-popconfirm>
                <el-button v-else type="success" size="small" @click="onRecoverUser(scope.row.uid)">恢复</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="9">
          <el-card>
            <template #header>创建用户</template>
            <el-form :model="newUserForm" label-width="auto" label-position="left">
              <el-form-item label="用户名">
                <el-input v-model="newUserForm.username" placeholder="请输入用户名" autocomplete="off" />
              </el-form-item>
              <el-form-item label="密码">
                <el-input
                  v-model="newUserForm.password"
                  placeholder="请输入密码"
                  type="password"
                  show-password
                  autocomplete="off"
                />
              </el-form-item>
              <el-form-item label="用户组">
                <el-select v-model="newUserForm.role" placeholder="请选择用户组" autocomplete="off">
                  <el-option
                    v-for="item in userRoleOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="button-center" @click="onCreate">创建</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getUserList, createUser, deleteUser, recoverUser } from '@/api/user'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const filteredData = ref([])

const searchQuery = ref('')

const userRoleOptions = [
  {
    value: 0,
    label: '普通用户'
  },
  {
    value: 1,
    label: '管理员'
  }
]

const newUserForm = reactive({
  username: '',
  password: '',
  role: 0
})

const getUserListData = () => {
  getUserList()
    .then((res) => {
      if (res.data.code === 200) {
        tableData.value = res.data.data
        filteredData.value = res.data.data
      } else if (res.data.code == 401) {
        ElMessage.error('用户无权限')
      } else {
        ElMessage.error('未知错误')
      }
    })
    .catch((err) => {
      ElMessage.error('Error:', err)
    })
}

const fliterData = () => {
  if (!searchQuery.value) {
    filteredData.value = tableData.value
    return
  }
  filteredData.value = tableData.value.filter((row) => {
    return row.username.includes(searchQuery.value)
  })
}

const onCreate = () => {
  createUser(newUserForm)
    .then((res) => {
      if (res.data.code == 200) {
        ElMessage.success('创建成功')
        getUserListData()
      } else {
        ElMessage.error('创建失败')
      }
    })
    .catch((err) => {
      ElMessage.error('Error:', err)
    })
}

const onDeleteUser = (uid) => {
  deleteUser(uid)
    .then((res) => {
      if (res.data.code == 200) {
        ElMessage.success('禁用成功')
        getUserListData()
      } else {
        ElMessage.error('禁用失败')
      }
    })
    .catch((err) => {
      ElMessage.error('Error:', err)
    })
}

const onRecoverUser = (uid) => {
  recoverUser(uid)
    .then((res) => {
      if (res.data.code == 200) {
        ElMessage.success('恢复成功')
        getUserListData()
      } else {
        ElMessage.error('恢复失败')
      }
    })
    .catch((err) => {
      ElMessage.error('Error:', err)
    })
}

onMounted(() => {
  getUserListData()
})
</script>

<style>
.title {
  text-align: left;
}

.title-text {
  font-size: 1.5rem;
}

.card-header {
  font-size: 1.2rem;
}

.blank1 {
  height: 1em;
}
</style>

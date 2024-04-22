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
          <el-table :data="filteredData" border stripe max-height="500" style="width: 100%">
            <el-table-column prop="uid" label="用户ID" width="100" />
            <el-table-column prop="username" label="用户名" />
            <el-table-column label="用户组" width="100">
              <template #default="scope">
                <el-tag v-if="scope.row.role == 1" type="danger">管理员</el-tag>
                <el-tag v-else>普通用户</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="80">
              <template #default="scope">
                <el-tag v-if="scope.row.active == 1" type="success">正常</el-tag>
                <el-tag v-else type="danger">禁用</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="140">
              <template #default="scope">
                <el-button type="primary" size="small" @click="showUserInfo(scope.row.uid)"
                  >详细</el-button
                >
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
                <el-button v-else type="success" size="small" @click="onRecoverUser(scope.row.uid)"
                  >恢复</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="9">
          <el-card>
            <template #header>创建用户</template>
            <el-form :model="newUserForm" label-width="auto" label-position="left">
              <el-form-item label="用户名">
                <el-input
                  v-model="newUserForm.username"
                  placeholder="请输入用户名"
                  autocomplete="off"
                />
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

  <el-dialog v-model="userDialogVisible" :title="userInfo.username" width="40%">
    <el-table :data="userInfo.Regions" height="200" border stripe>
      <el-table-column prop="region_id" label="区域ID" width="80" />
      <el-table-column prop="region_name" label="区域名称" />
      <el-table-column label="操作" width="80">
        <template #default="scope">
          <el-popconfirm
            :icon="WarningFilled"
            icon-color="#F56C6C"
            title="确定要删除该区域所属关系吗？"
            confirm-button-text="确定"
            cancel-button-text="取消"
            @confirm="onDeleteUserRegion(userInfo.uid, scope.row.region_id)"
          >
            <template #reference>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <div class="blank1"></div>

    <el-row :gutter="20">
      <el-col :span="20">
        <el-select v-model="selectRegionID" placeholder="请选择区域" filterable clearable>
          <el-option
            v-for="item in regionList"
            :key="item.region_id"
            :label="item.region_name"
            :value="item.region_id"
          />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="onAddUserRegion(userInfo.uid, selectRegionID)"
          >添加</el-button
        >
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getUserList, createUser, deleteUser, recoverUser, getUser } from '@/api/user'
import { deleteUserRegion, addUserRegion } from '@/api/user_region'
import { getAllRegion } from '@/api/region'

const tableData = ref([])
const filteredData = ref([])

const searchQuery = ref('')

const userDialogVisible = ref(false)

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

const userInfo = ref({})

const regionList = ref([])

const selectRegionID = ref('')

/**
 * 获取用户列表数据
 * 该函数无参数
 * 该函数无显式返回值，但会更新tableData和filteredData的值
 */
const getUserListData = () => {
  // 尝试获取用户列表
  getUserList()
    .then((res) => {
      // 请求成功后，根据返回码处理数据
      if (res.data.code === 200) {
        tableData.value = res.data.data // 更新表格数据
        filteredData.value = res.data.data // 更新过滤后数据
      } else if (res.data.code == 401) {
        ElMessage.error('用户无权限') // 无权限错误提示
      } else {
        ElMessage.error('未知错误') // 未知错误提示
      }
    })
    .catch((err) => {
      ElMessage.error('Error:', err) // 捕获并提示请求过程中的错误
    })
}

/**
 * 根据搜索查询筛选数据。
 * 没有搜索查询时显示全部数据，有搜索查询时只显示包含搜索关键字的数据。
 */
const fliterData = () => {
  // 如果没有搜索查询，显示全部数据
  if (!searchQuery.value) {
    filteredData.value = tableData.value
    return
  }
  // 根据搜索查询筛选数据
  filteredData.value = tableData.value.filter((row) => {
    return row.username.includes(searchQuery.value)
  })
}

/**
 * 创建用户后触发的函数
 * 无参数
 * 无返回值
 */
const onCreate = () => {
  // 尝试创建新用户
  createUser(newUserForm)
    .then((res) => {
      // 如果创建成功（返回码200），则显示成功消息并刷新用户列表
      if (res.data.code == 200) {
        newUserForm.username = '' // 清空用户名输入框
        newUserForm.password = '' // 清空密码输入框
        newUserForm.role = 0 // 重置用户组选择
        ElMessage.success('创建成功')
        getUserListData()
      } else {
        // 如果创建失败，显示错误消息
        ElMessage.error('创建失败')
      }
    })
    .catch((err) => {
      // 捕获任何创建用户时发生的错误，并显示错误消息
      ElMessage.error('Error:', err)
    })
}

/**
 * 删除用户
 * @param {String} uid 用户唯一标识符
 * @description 调用deleteUser函数删除指定用户，成功后刷新用户列表
 */
const onDeleteUser = (uid) => {
  deleteUser(uid) // 删除用户
    .then((res) => {
      // 删除成功后的处理
      if (res.data.code == 200) {
        // 删除成功
        ElMessage.success('禁用成功') // 显示成功消息
        getUserListData() // 刷新用户列表
      } else {
        // 删除失败
        ElMessage.error('禁用失败')
      }
    })
    .catch((err) => {
      // 处理删除过程中出现的错误
      ElMessage.error('Error:', err) // 显示错误消息
    })
}

/**
 * 恢复用户操作的处理函数
 * @param {String} uid 用户的唯一标识符
 * 该函数没有返回值
 */
const onRecoverUser = (uid) => {
  // 尝试恢复用户
  recoverUser(uid)
    .then((res) => {
      // 恢复成功后的处理
      if (res.data.code == 200) {
        ElMessage.success('恢复成功') // 显示成功消息
        getUserListData() // 获取更新后的用户列表数据
      } else {
        ElMessage.error('恢复失败') // 显示失败消息
      }
    })
    .catch((err) => {
      // 捕获并处理恢复用户操作中的错误
      ElMessage.error('Error:', err) // 显示错误消息
    })
}

/**
 * 根据用户标识符获取用户信息并更新到userInfo中。
 * @param {String} uid 用户的唯一标识符。
 */
const getUserInfo = (uid) => {
  // 根据用户标识符获取用户信息
  getUser(uid)
    .then((res) => {
      // 请求成功后，根据返回码判断是否成功获取信息
      if (res.data.code == 200) {
        userInfo.value = res.data.data // 更新用户信息
      } else {
        // 获取信息失败时，显示错误消息
        ElMessage.error('获取用户信息失败')
      }
    })
    .catch((err) => {
      // 请求发生错误时，显示错误消息
      ElMessage.error('Error:', err)
    })
}

/**
 * 显示用户信息的函数
 * @param {number} uid 用户的唯一标识符
 * 该函数没有返回值
 */
const showUserInfo = (uid) => {
  getUserInfo(uid) // 获取用户信息
  userDialogVisible.value = true // 显示用户信息对话框
}

/**
 * 删除用户所属的区域信息
 * @param {String} uid 用户唯一标识符
 * @param {String} region_id 区域ID
 * @description 调用deleteUserRegion接口删除指定用户的区域信息，成功则提示删除成功并展示用户信息，失败则提示删除失败。
 */
const onDeleteUserRegion = (uid, region_id) => {
  // 构造请求DTO，包含要删除的用户ID和区域ID
  let DTO = {
    uid: uid,
    region_id: region_id
  }
  // 发起删除用户区域信息的请求
  deleteUserRegion(DTO)
    .then((res) => {
      // 请求成功后，根据返回码判断删除操作是否成功
      if (res.data.code == 200) {
        ElMessage.success('删除成功') // 删除成功，显示成功消息
        getUserInfo(uid) // 展示用户信息
      } else {
        ElMessage.error('删除失败') // 删除失败，显示错误消息
      }
    })
    .catch((err) => {
      ElMessage.error('Error:', err) // 请求异常，显示错误消息
    })
}

/**
 * 获取地区列表数据
 * 该函数没有参数
 * 没有返回值，但会更新regionList的值为获取到的地区列表数据
 */
const getRegionListData = () => {
  // 请求地区列表数据
  getAllRegion()
    .then((res) => {
      // 请求成功后，根据返回码更新地区列表
      if (res.data.code === 200) {
        regionList.value = res.data.data
      } else {
        // 返回码非200，显示错误消息
        ElMessage.error('未知错误')
      }
    })
    .catch((err) => {
      // 请求失败，显示错误消息
      ElMessage.error('Error:', err)
    })
}

/**
 * 为指定用户添加地区信息
 * @param {String} uid 用户唯一标识
 * @param {String} region_id 地区ID
 * @returns {Void} 无返回值
 */
const onAddUserRegion = (uid, region_id) => {
  // 构造请求DTO，包含用户ID和地域ID
  let DTO = {
    uid: uid,
    region_id: region_id
  }
  // 调用添加用户地区信息的函数，并处理返回结果
  addUserRegion(DTO)
    .then((res) => {
      // 请求成功，根据返回码判断添加操作是否成功
      if (res.data.code == 200) {
        ElMessage.success('添加成功') // 添加成功时，显示成功消息
        getUserInfo(uid) // 展示用户信息
      } else {
        ElMessage.error('添加失败') // 添加失败时，显示错误消息
      }
    })
    .catch((err) => {
      ElMessage.error('Error:', err) // 处理请求异常
    })
}

// 当组件挂载完成后，执行的逻辑
onMounted(() => {
  getUserListData() // 获取用户列表数据
  getRegionListData() // 获取地区列表数据
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

.card-header {
  font-size: 1.2rem;
}

.select-region-form .el-select {
  --el-select-width: 250px;
}
</style>

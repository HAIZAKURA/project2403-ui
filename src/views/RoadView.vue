<template>
  <div id="road">
    <div class="title">
      <span class="title-text">道&nbsp;路&nbsp;管&nbsp;理</span>
    </div>

    <el-divider></el-divider>

    <el-row :gutter="20">
      <el-col :span="15">
        <el-select
          v-model="selectRegionID"
          placeholder="请选择区域"
          @change="selectData"
          filterable
          clearable
        >
          <el-option
            v-for="item in regionList"
            :key="item.region_id"
            :label="item.region_name"
            :value="item.region_id"
          />
        </el-select>

        <div class="blank1"></div>

        <el-table :data="roadList" max-height="500" border stripe>
          <el-table-column prop="road_id" label="道路ID" width="80" />
          <el-table-column prop="road_name" label="道路名称" />
          <el-table-column label="操作" width="140">
            <template #default="scope">
              <el-button type="primary" size="small" @click="openUpdateRoad(scope.row)"
                >修改</el-button
              >
              <el-popconfirm
                :icon="WarningFilled"
                icon-color="#F56C6C"
                title="确定要删除该道路吗？"
                confirm-button-text="确定"
                cancel-button-text="取消"
                @confirm="onDeleteRoad(scope.row.road_id)"
              >
                <template #reference>
                  <el-button type="danger" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="9">
        <el-card>
          <template #header>添加道路</template>
          <el-form label-width="auto" label-position="left">
            <el-form-item label="道路名">
              <el-input v-model="new_road_name" placeholder="请输入新道路名" autocomplete="off" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="button-center" @click="onAddRoad">添加</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>

  <el-dialog v-model="updateDialogVisible" title="修改道路" width="30%">
    <el-form :model="updateRoadForm" label-width="auto" label-position="left">
      <el-form-item label="道路名">
        <el-input
          v-model="updateRoadForm.road_name"
          placeholder="请输入道路名"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="所属区域" style="display: none;">
        <el-select v-model="updateRoadForm.region_id" placeholder="请选择所属区域" filterable>
          <el-option
            v-for="item in regionList"
            :key="item.region_id"
            :label="item.region_name"
            :value="item.region_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="button-center" @click="onUpdateRoad">修改</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { getUser } from '@/api/user'
import { deleteRoad, addRoad, getRoadListByRegion, updateRoad } from '@/api/road'

const regionList = ref([])

const roadList = ref([])

const selectRegionID = ref('')

const new_road_name = ref('')

const updateRoadForm = reactive({
  road_id: '',
  road_name: '',
  region_id: ''
})

const updateDialogVisible = ref(false)

/**
 * 根据用户的UID获取地区列表。
 * 该函数首先从localStorage中获取用户的UID，然后使用这个UID来获取用户的相关地区信息。
 * 如果获取成功，将更新regionList的值为用户所在的地区列表；如果失败，将显示相应的错误消息。
 */
const getRegionListByUser = () => {
  // 使用localStorage中的UID获取用户信息
  getUser(localStorage.getItem('uid'))
    .then((res) => {
      if (res.data.code == 200) {
        // 成功获取信息，更新regionList
        regionList.value = res.data.data.users_region
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
 * 获取指定区域ID的道路列表。
 * @param {number} region_id - 区域ID，用于查询该区域的道路列表。
 */
const onGetRoadList = (region_id) => {
  // 获取指定区域的道路列表
  getRoadListByRegion(region_id)
    .then((res) => {
      if (res.data.code == 200) {
        // 请求成功，更新道路列表
        roadList.value = res.data.data
      } else {
        // 请求失败，显示错误消息
        ElMessage.error('获取用户信息失败')
      }
    })
    .catch((err) => {
      // 捕获并显示请求过程中的错误
      ElMessage.error('Error:', err)
    })
}

/**
 * 删除指定的道路
 * @param {String} road_id 道路的ID标识
 *
 * 该函数首先尝试删除指定ID的道路，如果删除成功，则会更新道路列表并显示成功消息。
 * 如果删除失败，则会显示错误消息。在删除过程中如果出现网络错误，也会捕获并显示相应的错误消息。
 */
const onDeleteRoad = (road_id) => {
  // 删除道路
  deleteRoad(road_id)
    .then((res) => {
      if (res.data.code == 200) {
        // 成功删除，更新道路列表并显示成功消息
        ElMessage.success('删除成功')
        onGetRoadList(selectRegionID.value) // 更新道路列表
      } else {
        // 删除失败时，显示错误消息
        ElMessage.error('删除失败')
      }
    })
    .catch((err) => {
      // 捕获并提示请求过程中的错误
      ElMessage.error('Error:', err)
    })
}

/**
 * 点击添加道路时的处理函数
 * 无参数
 * 无返回值
 */
const onAddRoad = () => {
  // 准备道路添加所需的DTO（数据传输对象）
  let DTO = {
    road_name: new_road_name.value, // 道路名称
    region_id: selectRegionID.value // 区域ID
  }
  // 调用添加道路的API
  addRoad(DTO)
    .then((res) => {
      if (res.data.code == 200) {
        // 添加成功时的处理
        new_road_name.value = '' // 重置道路名称输入框
        ElMessage.success('添加成功') // 显示成功消息
        onGetRoadList(selectRegionID.value) // 更新道路列表
      } else {
        // 添加失败时的处理
        ElMessage.error('添加失败') // 显示错误消息
      }
    })
    .catch((err) => {
      // 捕获并提示请求过程中的错误
      ElMessage.error('Error:', err)
    })
}

/**
 * 打开更新道路信息的对话框。
 * @param {Object} item - 道路对象，包含需要更新的 road_id, road_name 和 region_id。
 */
const openUpdateRoad = (item) => {
  // 使用传入的item信息初始化更新道路表单
  updateRoadForm.road_id = item.road_id
  updateRoadForm.road_name = item.road_name
  updateRoadForm.region_id = item.region_id
  // 设置对话框可见性为true，以显示更新表单
  updateDialogVisible.value = true
}

/**
 * 更新道路信息的函数
 */
const onUpdateRoad = () => {
  // 调用更新道路信息的API
  updateRoad(updateRoadForm.road_id, updateRoadForm)
    .then((res) => {
      if (res.data.code == 200) {
        // 更新成功后的处理逻辑
        ElMessage.success('更新成功')
        updateDialogVisible.value = false // 关闭更新对话框
        onGetRoadList(selectRegionID.value) // 获取更新后的道路列表
        updateRoadForm.road_id = '' // 重置道路ID表单字段
        updateRoadForm.road_name = '' // 重置道路名称表单字段
        updateRoadForm.region_id = '' // 重置区域ID表单字段
      } else {
        // 更新失败后的处理逻辑
        ElMessage.error('更新失败')
      }
    })
    .catch((err) => {
      // 捕获并提示请求过程中的错误
      ElMessage.error('Error:', err)
    })
}

/**
 * 选择数据函数
 * 该函数根据所选的区域ID来获取相应的道路列表。
 */
const selectData = () => {
  // 如果没有选择区域或选择的区域ID未定义，则清空道路列表
  if (selectRegionID.value == '' || selectRegionID.value == undefined) {
    roadList.value = []
  } else {
    // 如果有选择区域，则获取该区域的道路列表
    onGetRoadList(selectRegionID.value)
  }
}

onMounted(() => {
  getRegionListByUser()
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

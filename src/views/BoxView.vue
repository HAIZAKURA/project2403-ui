<template>
  <div id="box">
    <div class="title">
      <span class="title-text">设&nbsp;备&nbsp;管&nbsp;理</span>
    </div>

    <el-divider></el-divider>

    <el-row :gutter="20">
      <el-col :span="14">
        <el-row :gutter="20">
          <el-col :span="11">
            <el-select
              v-model="selectRegionID"
              placeholder="请选择区域"
              @change="handleSelectRegion"
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
          </el-col>
          <el-col :span="11">
            <el-select
              v-model="selectRoadID"
              placeholder="请选择道路"
              @change="handleSelectRoad"
              filterable
              clearable
            >
              <el-option
                v-for="item in roadList"
                :key="item.road_id"
                :label="item.road_name"
                :value="item.road_id"
              />
            </el-select>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" :icon="Plus" circle @click="handleAddClick" />
          </el-col>
        </el-row>
        <div class="blank1"></div>
        <el-table :data="boxList" border stripe max-height="650" style="width: 100%">
          <el-table-column fixed prop="box_id" label="云盒ID" width="140" />
          <el-table-column prop="leakage_id" label="漏电保护ID" width="140" />
          <el-table-column prop="light_id" label="名称" width="200" />
          <el-table-column prop="state" label="状态" width="60" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.state == 1" type="success">开</el-tag>
              <el-tag v-else type="danger">关</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="brightness" label="亮度" width="70" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.brightness == 0" type="danger" effect="plain">{{
                scope.row.brightness
              }}</el-tag>
              <el-tag v-else type="primary" effect="plain">{{ scope.row.brightness }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="longitude" label="经度" width="120" />
          <el-table-column prop="latitude" label="纬度" width="120" />
          <el-table-column fixed="right" label="操作" width="170" align="center">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="handleEditBox(scope.row.box_id)"
                >详细</el-button
              >
              <el-button link type="primary" size="small" @click="handleEditTime(scope.row.box_id)"
                >时间策略</el-button
              >
              <el-popconfirm
                :icon="WarningFilled"
                icon-color="#F56C6C"
                title="确定要删除该设备吗？"
                confirm-button-text="确定"
                cancel-button-text="取消"
                @confirm="handleDeleteBox(scope.row.box_id)"
              >
                <template #reference>
                  <el-button link type="danger" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="10">
        <div id="map-container"></div>
      </el-col>
    </el-row>
  </div>

  <el-dialog v-model="boxDialogVisible" title="云盒详细" width="30%">
    <el-form :model="boxInfo" label-width="auto" label-position="left">
      <el-form-item label="云盒ID">{{ boxInfo.box_id }}</el-form-item>
      <el-form-item label="漏电保护ID">{{ boxInfo.leakage_id }}</el-form-item>
      <el-form-item label="名称">
        <el-input v-model="boxInfo.light_id" placeholder="请输入设备名称" />
      </el-form-item>
      <el-form-item label="经度">
        <el-input v-model="boxInfo.longitude" placeholder="请输入经度" />
      </el-form-item>
      <el-form-item label="纬度">
        <el-input v-model="boxInfo.latitude" placeholder="请输入纬度" />
      </el-form-item>
      <el-form-item label="区域">
        <el-select
          v-model="boxInfo.region_id"
          @change="handleSelectRegion2(boxInfo.region_id)"
          placeholder="请选择区域"
          filterable
          clearable
        >
          <el-option
            v-for="item in regionList2"
            :key="item.region_id"
            :label="item.region_name"
            :value="item.region_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="道路">
        <el-select v-model="boxInfo.road_id" placeholder="请选择道路" filterable clearable>
          <el-option
            v-for="item in roadList2"
            :key="item.road_id"
            :label="item.road_name"
            :value="item.road_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="button-center" @click="onUpdateBox">修改</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <el-dialog v-model="timeDialogVisible" title="时间策略" width="30%">
    <el-form :model="boxTime" v-loading="boxTimeLoading" label-width="auto" label-position="left">
      <el-form-item label="云盒ID">{{ boxTime.box_id }}</el-form-item>
      <el-form-item label="开始时间（时）">
        <el-input type="number" v-model="boxTime.t_hour" placeholder="请输入开始时间（时）" />
      </el-form-item>
      <el-form-item label="开始时间（分）">
        <el-input type="number" v-model="boxTime.t_minute" placeholder="请输入开始时间（分）" />
      </el-form-item>
      <el-form-item label="第1阶段时长">
        <el-input type="number" v-model="boxTime.s1_t" placeholder="请输入第1阶段时长" />
      </el-form-item>
      <el-form-item label="第1阶段亮度">
        <el-input type="number" v-model="boxTime.s1_b" placeholder="请输入第1阶段亮度" />
      </el-form-item>
      <el-form-item label="第2阶段时长">
        <el-input type="number" v-model="boxTime.s2_t" placeholder="请输入第2阶段时长" />
      </el-form-item>
      <el-form-item label="第2阶段亮度">
        <el-input type="number" v-model="boxTime.s2_b" placeholder="请输入第2阶段亮度" />
      </el-form-item>
      <el-form-item label="第3阶段时长">
        <el-input type="number" v-model="boxTime.s3_t" placeholder="请输入第3阶段时长" />
      </el-form-item>
      <el-form-item label="第3阶段亮度">
        <el-input type="number" v-model="boxTime.s3_b" placeholder="请输入第3阶段亮度" />
      </el-form-item>
      <el-form-item label="第4阶段时长">
        <el-input type="number" v-model="boxTime.s4_t" placeholder="请输入第4阶段时长" />
      </el-form-item>
      <el-form-item label="第4阶段亮度">
        <el-input type="number" v-model="boxTime.s4_b" placeholder="请输入第4阶段亮度" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="button-center" @click="onSetBox">设置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <el-dialog v-model="addDialogVisible" title="添加云盒" width="30%" :before-close="beforeAddBoxClose">
    <el-form :model="addBoxForm" label-width="auto" label-position="left">
      <el-form-item label="云盒ID">
        <el-input v-model="addBoxForm.box_id" placeholder="请输入云盒ID" />
      </el-form-item>
      <el-form-item label="漏保ID">
        <el-input v-model="addBoxForm.leakage_id" placeholder="请输入漏保ID" />
      </el-form-item>
      <el-form-item label="灯名称">
        <el-input v-model="addBoxForm.light_id" placeholder="请输入灯名称" />
      </el-form-item>
      <el-form-item label="经度">
        <el-input v-model="addBoxForm.longitude" placeholder="请输入经度" />
      </el-form-item>
      <el-form-item label="纬度">
        <el-input v-model="addBoxForm.latitude" placeholder="请输入纬度" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onAddBox">添加</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AMapLoader from '@amap/amap-jsapi-loader'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getUser } from '@/api/user'
import { getRoadListByRegion } from '@/api/road'
import {
  getBoxListByRegion,
  getBoxListByRoad,
  getBox,
  deleteBox,
  updateBox,
  setBox,
  addBox
} from '@/api/box'

const router = useRouter()

const selectRegionID = ref('')

const regionList = ref([])

const selectRoadID = ref('')

const roadList = ref([])

const regionList2 = ref([])

const roadList2 = ref([])

const boxList = ref([])

const boxInfo = reactive({
  box_id: '',
  leakage_id: '',
  light_id: '',
  longitude: '',
  latitude: '',
  region_id: '',
  road_id: ''
})

const boxTime = reactive({
  box_id: '',
  t_hour: '',
  t_minute: '',
  s1_t: '',
  s1_b: '',
  s2_t: '',
  s2_b: '',
  s3_t: '',
  s3_b: '',
  s4_t: '',
  s4_b: ''
})

const addBoxForm = reactive({
  box_id: '',
  leakage_id: '',
  light_id: '',
  longitude: '',
  latitude: '',
  region_id: '',
  road_id: ''
})

const boxDialogVisible = ref(false)
const timeDialogVisible = ref(false)
const boxTimeLoading = ref(false)
const addDialogVisible = ref(false)

window._AMapSecurityConfig = {
  securityJsCode: import.meta.env.VITE_AMAP_CODE
}

let map = null

let Amap = null

onMounted(() => {
  getRegionListByUser()
  AMapLoader.load({
    key: import.meta.env.VITE_AMAP_KEY,
    version: '2.0',
    plugins: [
      'AMap.Scale',
      'AMap.ToolBar',
      'AMap.Geocoder',
      'AMap.MarkerCluster',
      'AMap.ElasticMarker',
      'AMap.ControlBar',
      'AMap.MapType',
      'AMap.Geolocation'
    ]
  })
    .then((res) => {
      Amap = res
      map = new Amap.Map('map-container', {
        viewMode: '3D',
        center: [116.397428, 39.90923],
        zoom: 11
      })
      map.addControl(new Amap.Scale())
      map.addControl(new Amap.ToolBar())
      map.addControl(new Amap.ControlBar())
      map.addControl(new Amap.MapType({ showRoad: true }))
    })
    .catch((e) => {
      ElMessage.error(e)
    })
})

onUnmounted(() => {
  map?.destroy()
})

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
        regionList.value = res.data.data.Regions
      } else {
        // 获取信息失败时，显示错误消息
        ElMessage.error('获取用户信息失败')
        localStorage.clear() // 清除本地存储
        router.push('/login') // 重定向到登录页
      }
    })
    .catch((err) => {
      // 请求发生错误时，显示错误消息
      ElMessage.error('Error:', err)
    })
}

/**
 * 根据用户的UID获取地区列表。
 * 该函数首先从localStorage中获取用户的UID，然后使用这个UID来获取用户的相关地区信息。
 * 如果获取成功，将更新regionList的值为用户所在的地区列表；如果失败，将显示相应的错误消息。
 */
const getRegionList2ByUser = () => {
  // 使用localStorage中的UID获取用户信息
  getUser(localStorage.getItem('uid'))
    .then((res) => {
      if (res.data.code == 200) {
        // 成功获取信息，更新regionList2
        regionList2.value = res.data.data.Regions
      } else {
        // 获取信息失败时，显示错误消息
        ElMessage.error('获取用户信息失败')
        localStorage.clear() // 清除本地存储
        router.push('/login') // 重定向到登录页
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
        ElMessage.error('获取信息失败')
      }
    })
    .catch((err) => {
      // 捕获并显示请求过程中的错误
      ElMessage.error('Error:', err)
    })
}

/**
 * 处理区域选择函数
 * 该函数根据所选的区域ID来获取相应的道路列表。
 */
const handleSelectRegion = () => {
  // 如果没有选择区域或选择的区域ID未定义，则清空道路列表
  if (selectRegionID.value == '' || selectRegionID.value == undefined) {
    roadList.value = []
  } else {
    // 如果有选择区域，则获取该区域的道路列表
    onGetRoadList(selectRegionID.value)
    getBoxListByRegion(selectRegionID.value)
      .then((res) => {
        if (res.data.code == 200) {
          // 请求成功，更新云盒列表
          boxList.value = res.data.data
          map.clearMap()
          boxList.value.forEach((box) => {
            // 创建一个Marker实例，用于在地图上显示云盒
            let markerContent = ''
            if (box.state == 1) {
              markerContent = '<img src="https://wx.nya.run/poi-marker-blue.png" />'
            } else {
              markerContent = '<img src="https://wx.nya.run/poi-marker-red.png" />'
            }
            let marker = new Amap.Marker({
              position: [box.longitude, box.latitude],
              content: markerContent
            })
            marker.setTitle(box.box_id)
            marker.setLabel({
              content: box.light_id
            })
            marker.on('click', (e) => {
              handleEditBox(e.target.getTitle())
            })
            // 将云盒添加到地图上
            map.add(marker)
          })
          map.setFitView(null, true)
        } else {
          // 请求失败，显示错误消息
          ElMessage.error('获取信息失败')
        }
      })
      .catch((err) => {
        // 捕获并显示请求过程中的错误
        ElMessage.error('Error:', err)
      })
  }
}

/**
 * 处理选择道路的事件
 * 根据选定的道路ID获取相应的云盒列表
 */
const handleSelectRoad = () => {
  // 检查选择的道路ID是否为空或未定义
  if (selectRoadID.value == '' || selectRoadID.value == undefined) {
    return
  } else {
    // 道路ID不为空时，发起请求获取云盒列表
    getBoxListByRoad(selectRoadID.value)
      .then((res) => {
        // 请求成功时，根据返回数据更新云盒列表
        if (res.data.code == 200) {
          boxList.value = res.data.data
          map.clearMap()
          boxList.value.forEach((box) => {
            // 创建一个Marker实例，用于在地图上显示云盒
            let markerContent = ''
            if (box.state == 1) {
              markerContent = '<img src="https://wx.nya.run/poi-marker-blue.png" />'
            } else {
              markerContent = '<img src="https://wx.nya.run/poi-marker-red.png" />'
            }
            let marker = new Amap.Marker({
              position: [box.longitude, box.latitude],
              content: markerContent
            })
            marker.setTitle(box.box_id)
            marker.setLabel({
              content: box.light_id
            })
            marker.on('click', (e) => {
              handleEditBox(e.target.getTitle())
            })
            // 将云盒添加到地图上
            map.add(marker)
          })
          map.setFitView(null, true)
        } else {
          // 请求失败时，显示错误消息
          ElMessage.error('获取信息失败')
        }
      })
      .catch((err) => {
        // 捕获请求过程中的错误并显示
        ElMessage.error('Error:', err)
      })
  }
}

/**
 * 处理云盒编辑框的操作。
 * @param {string} box_id - 云盒的ID。
 * 该函数无返回值。
 */
const handleEditBox = (box_id) => {
  // 根据box_id获取云盒信息
  getBox(box_id)
    .then((res) => {
      // 请求成功时的操作
      if (res.data.code == 200) {
        // 初始化编辑对话框状态并填充云盒信息
        boxDialogVisible.value = true
        boxInfo.box_id = res.data.data.box_id
        boxInfo.leakage_id = res.data.data.leakage_id
        boxInfo.light_id = res.data.data.light_id
        boxInfo.longitude = res.data.data.longitude
        boxInfo.latitude = res.data.data.latitude
        boxInfo.region_id = res.data.data.region_id
        boxInfo.road_id = res.data.data.road_id
        // 获取区域列表
        getRegionList2ByUser()
        // 根据区域ID获取道路列表
        getRoadListByRegion(boxInfo.region_id)
          .then((res) => {
            // 请求成功时更新道路列表
            if (res.data.code == 200) {
              roadList2.value = res.data.data
            } else {
              // 请求失败时显示错误消息
              ElMessage.error('获取信息失败')
            }
          })
          .catch((err) => {
            // 捕获并显示请求过程中的错误
            ElMessage.error('Error:', err)
          })
      } else {
        // 请求失败时显示错误消息
        ElMessage.error('获取信息失败')
      }
    })
    .catch((err) => {
      // 捕获请求过程中的错误并显示
      ElMessage.error('Error:', err)
    })
}

/**
 * 处理编辑时间的函数。
 * @param {string} box_id - 云盒的ID。
 * 该函数根据给定的云盒ID，获取该云盒的时间配置信息，并更新相关的编辑对话框中的表单数据。
 * 如果请求成功，会更新表单数据并显示编辑对话框；如果请求失败，会显示错误消息。
 */
const handleEditTime = (box_id) => {
  // 根据box_id获取云盒信息
  getBox(box_id)
    .then((res) => {
      // 请求成功时的处理逻辑
      if (res.data.code == 200) {
        // 更新编辑对话框中的表单数据
        boxTime.box_id = res.data.data.box_id
        boxTime.t_hour = res.data.data.t_hour
        boxTime.t_minute = res.data.data.t_minute
        boxTime.s1_t = res.data.data.s1_t
        boxTime.s1_b = res.data.data.s1_b
        boxTime.s2_t = res.data.data.s2_t
        boxTime.s2_b = res.data.data.s2_b
        boxTime.s3_t = res.data.data.s3_t
        boxTime.s3_b = res.data.data.s3_b
        boxTime.s4_t = res.data.data.s4_t
        boxTime.s4_b = res.data.data.s4_b
        // 显示编辑对话框
        timeDialogVisible.value = true
      } else {
        // 请求成功但获取信息失败的错误处理
        ElMessage.error('获取信息失败')
      }
    })
    .catch((err) => {
      // 请求过程中出现的错误处理
      ElMessage.error('Error:', err)
    })
}

/**
 * 处理选择区域的事件，根据指定区域ID获取该区域的道路列表
 * @param {number|string} region_id - 区域的ID
 * 该函数没有返回值
 */
const handleSelectRegion2 = (region_id) => {
  // 请求指定区域的道路列表
  getRoadListByRegion(region_id)
    .then((res) => {
      if (res.data.code == 200) {
        // 请求成功，更新道路列表并重置道路ID
        roadList2.value = res.data.data
        boxInfo.road_id = ''
      } else {
        // 请求失败，显示错误消息
        ElMessage.error('获取信息失败')
      }
    })
    .catch((err) => {
      // 捕获并显示请求过程中的错误
      ElMessage.error('Error:', err)
    })
}

/**
 * 更新箱子信息的事件处理函数。
 * 无参数
 * 无返回值
 */
const onUpdateBox = () => {
  updateBox(boxInfo.box_id, boxInfo)
    .then((res) => {
      if (res.data.code == 200) {
        // 请求成功时，显示成功消息
        ElMessage.success('修改成功')
        boxDialogVisible.value = false
        boxInfo.box_id = ''
        boxInfo.leakage_id = ''
        boxInfo.light_id = ''
        boxInfo.longitude = ''
        boxInfo.latitude = ''
        boxInfo.region_id = ''
        boxInfo.road_id = ''
        if (selectRoadID.value != '' && selectRoadID.value != undefined) {
          handleSelectRoad()
        } else if (selectRegionID.value != '' && selectRegionID.value != undefined) {
          handleSelectRegion()
        }
        boxDialogVisible.value = false
      } else {
        // 请求失败，显示错误消息
        ElMessage.error('修改失败')
      }
    })
    .catch((err) => {
      // 捕获请求过程中的错误并显示
      ElMessage.error('Error:', err)
    })
}

/**
 * 触发设置盒子时间的函数，当操作完成后，重置相关字段，并根据操作结果展示消息。
 */
const onSetBox = () => {
  boxTimeLoading.value = true
  setBox(boxTime.box_id, boxTime)
    .then((res) => {
      if (res.data.code == 200) {
        // 请求成功时，显示成功消息
        setTimeout(() => {
          ElMessage.success('设置指令已发送')
          boxTime.box_id = ''
          boxTime.t_hour = ''
          boxTime.t_minute = ''
          boxTime.s1_t = ''
          boxTime.s1_b = ''
          boxTime.s2_t = ''
          boxTime.s2_b = ''
          boxTime.s3_t = ''
          boxTime.s3_b = ''
          boxTime.s4_t = ''
          boxTime.s4_b = ''
          boxTimeLoading.value = false
          timeDialogVisible.value = false
        }, 3000)
      } else {
        // 请求失败，显示错误消息
        ElMessage.error('设置指令发送失败')
      }
    })
    .catch((err) => {
      // 捕获请求过程中的错误并显示
      ElMessage.error('Error:', err)
    })
}

/**
 * 处理删除框的逻辑。
 * @param {string} box_id - 要删除的框的ID。
 * 该函数没有返回值。
 */
const handleDeleteBox = (box_id) => {
  // 调用删除框的API
  deleteBox(box_id)
    .then((res) => {
      if (res.data.code == 200) {
        // 删除成功时的处理逻辑
        ElMessage.success('删除成功')
        // 根据条件调用不同的处理函数
        if (selectRoadID.value != '' && selectRoadID.value != undefined) {
          handleSelectRoad()
        } else if (selectRegionID.value != '' && selectRegionID.value != undefined) {
          handleSelectRegion()
        }
      } else {
        // 删除失败时的处理逻辑
        ElMessage.error('删除失败')
      }
    })
    .catch((err) => {
      // 捕获并处理请求过程中的错误
      ElMessage.error('Error:', err)
    })
}

const handleAddClick = () => {
  if (selectRoadID.value == '' || selectRoadID.value == undefined || selectRegionID.value == '' || selectRegionID.value == undefined) {
    ElMessage.error('请先选择区域和道路')
  } else {
    addDialogVisible.value = true
    addBoxForm.region_id = selectRegionID.value
    addBoxForm.road_id = selectRoadID.value
  }
}

const beforeAddBoxClose = () => {
  addBoxForm.box_id = ''
  addBoxForm.leakage_id = ''
  addBoxForm.light_id = ''
  addBoxForm.longitude = ''
  addBoxForm.latitude = ''
  addBoxForm.region_id = ''
  addBoxForm.road_id = ''
  addDialogVisible.value = false
}

const onAddBox = () => {
  addBox(addBoxForm)
    .then((res) => {
      if (res.data.code == 200) {
        ElMessage.success('添加成功')
        beforeAddBoxClose()
        handleSelectRoad()
      } else {
        ElMessage.error('添加失败')
      }
    })
    .catch((err) => {
      ElMessage.error('Error:', err)
    })
}
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

#map-container {
  width: 100%;
  height: 100%;
  min-height: 500px;
}
</style>

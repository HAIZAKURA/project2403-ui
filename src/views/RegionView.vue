<template>
  <div id="region">
    <div class="title">
      <span class="title-text">区&nbsp;域&nbsp;管&nbsp;理</span>
    </div>

    <el-divider></el-divider>

    <el-row :gutter="20">
      <el-col :span="15">
        <el-input v-model="searchQuery" @input="fliterData" placeholder="请输入区域名" />
        <div class="blank1"></div>
        <el-table :data="filteredList" border stripe max-height="500">
          <el-table-column prop="region_id" label="区域ID" width="100" />
          <el-table-column prop="region_name" label="区域名" />
          <el-table-column label="操作" width="140">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleUpdateRegion(scope.row)"
                >修改</el-button
              >
              <el-popconfirm
                :icon="WarningFilled"
                icon-color="#F56C6C"
                title="确定要删除该区域吗？"
                confirm-button-text="确定"
                cancel-button-text="取消"
                @confirm="handleDeleteRegion(scope.row.region_id)"
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
          <template #header>添加区域</template>
          <el-form label-width="auto" label-position="left">
            <el-form-item label="区域名">
              <el-input
                v-model="new_region.region_name"
                placeholder="请输入新区域名"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="button-center" @click="onAddRegion">添加</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>

  <el-dialog title="修改区域名" v-model="regionDialogVisible" width="30%">
    <el-form label-width="auto" label-position="left">
      <el-form-item label="区域名">
        <el-input v-model="region.region_name" placeholder="请输入新区域名" autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onUpdataRegion">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { getAllRegion, deleteRegion, updateRegion, addRegion } from '@/api/region'

const new_region = reactive({
  region_name: ''
})

const region = reactive({
  region_id: '',
  region_name: ''
})

const regionList = ref([])
const filteredList = ref([])

const searchQuery = ref('')

const regionDialogVisible = ref(false)

const getRegionList = () => {
  getAllRegion()
    .then((res) => {
      if (res.data.code == 200) {
        regionList.value = res.data.data
        filteredList.value = res.data.data
      } else {
        ElMessage.error('获取区域信息失败')
      }
    })
    .catch((err) => {
      ElMessage.error(err)
    })
}

const handleDeleteRegion = (region_id) => {
  deleteRegion(region_id)
    .then((res) => {
      if (res.data.code == 200) {
        ElMessage.success('删除区域成功')
        getRegionList()
      } else {
        ElMessage.error('删除区域失败')
      }
    })
    .catch((err) => {
      ElMessage.error(err)
    })
}

const handleUpdateRegion = (row) => {
  region.region_id = row.region_id
  region.region_name = row.region_name
  regionDialogVisible.value = true
}

const onUpdataRegion = () => {
  updateRegion(region.region_id, region)
    .then((res) => {
      if (res.data.code == 200) {
        ElMessage.success('修改区域成功')
        regionDialogVisible.value = false
        region.region_id = ''
        region.region_name = ''
        getRegionList()
      } else {
        ElMessage.error('修改区域失败')
      }
    })
    .catch((err) => {
      ElMessage.error(err)
    })
}

const onAddRegion = () => {
  addRegion(new_region)
    .then((res) => {
      if (res.data.code == 200) {
        ElMessage.success('添加区域成功')
        new_region.region_name = ''
        getRegionList()
      } else {
        ElMessage.error('添加区域失败')
      }
    })
    .catch((err) => {
      ElMessage.error(err)
    })
}

/**
 * 根据搜索查询筛选数据。
 * 没有搜索查询时显示全部数据，有搜索查询时只显示包含搜索关键字的数据。
 */
 const fliterData = () => {
  // 如果没有搜索查询，显示全部数据
  if (!searchQuery.value) {
    filteredList.value = regionList.value
    return
  }
  // 根据搜索查询筛选数据
  filteredList.value = regionList.value.filter((row) => {
    return row.region_name.includes(searchQuery.value)
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
</style>

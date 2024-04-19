import request from '@/utils/request'

/**
 * 获取地区列表
 * 该函数用于从服务器获取地区的列表信息。
 * 
 * @returns {Promise} 返回一个Promise对象，成功时携带地区列表信息。
 */
export function getAllRegion() {
  // 发起GET请求获取地区列表
  return request({
    url: '/api/region',
    method: 'get'
  })
}

/**
 * 根据区域ID获取区域信息
 * 
 * @param {string|number} region_id - 区域的ID标识
 * @return {Promise} 返回一个Promise对象，成功时携带从服务器获取的区域信息
 */
export function getRegion(region_id) {
  // 发起GET请求获取指定ID的区域信息
  return request({
    url: '/api/region/' + region_id,
    method: 'get'
  })
}

/**
 * 删除指定区域ID的信息
 * 
 * @param {number} region_id - 需要删除的区域的ID
 * @return {Promise} 返回一个Promise对象，成功或失败取决于请求的处理情况
 */
export function deleteRegion(region_id) {
  // 使用DELETE方法发起删除指定ID的区域信息的请求
  return request({
    url: '/api/region/' + region_id, // 构造请求的URL
    method: 'delete' // 指定请求方法为DELETE
  })
}

/**
 * 更新指定ID的区域信息
 * @param {number} region_id - 区域的唯一标识符
 * @param {Object} DTO - 数据传输对象，包含将要更新的区域信息
 * @returns 返回一个Promise对象，用于处理请求的结果
 */
export function updateRegion(region_id, DTO) {
  // 使用PUT方法发起更新指定ID的区域信息的请求
  return request({
    url: '/api/region/' + region_id, // 构造请求的URL
    method: 'put', // 指定请求方法为PUT
    data: DTO // 将要更新的数据作为请求体
  })
}

export function addRegion(DTO) {
  // 使用POST方法发起添加区域的请求
  return request({
    url: '/api/region', // 构造请求的URL
    method: 'post', // 指定请求方法为POST
    data: DTO // 将要添加的区域信息作为请求体
  })
}
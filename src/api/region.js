import request from '@/utils/request'

/**
 * 获取地区列表
 * 该函数用于从服务器获取地区的列表信息。
 * 
 * @returns {Promise} 返回一个Promise对象，成功时携带地区列表信息。
 */
export function getRegionList() {
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
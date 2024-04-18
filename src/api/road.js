import request from '@/utils/request'

/**
 * 删除指定的路名
 * @param {string} road_id - 要删除的路的ID。
 * @returns 返回一个请求对象，该请求将发送到'/api/road/' + road_id的URL，使用DELETE方法。
 */
export function deleteRoad(road_id) {
  // 发送删除路名的请求
  return request({
    url: '/api/road/' + road_id,
    method: 'delete',
  })
}

/**
 * 向服务器添加新的道路信息
 * @param {Object} DTO 数据传输对象，包含道路的详细信息
 * @returns {Promise} 返回一个Promise对象，用于处理请求的结果
 */
export function addRoad(DTO) {
  // 使用axios库发送POST请求，添加道路信息
  return request({
    url: '/api/road/', // 请求的URL
    method: 'post', // 请求方法为POST
    data: DTO, // 请求携带的数据
  })
}

export function updateRoad(road_id, DTO) {
  // 使用axios库发送PUT请求，更新指定ID的路信息
  return request({
    url: '/api/road/' + road_id, // 请求的URL
    method: 'put', // 请求方法为PUT
    data: DTO, // 请求携带的数据
  })
}

/**
 * 获取指定区域的路网列表
 * 
 * @param {number} region_id - 区域ID，用于指定需要获取路网信息的区域
 * @return {Promise} 返回一个Promise对象，成功时携带从服务器获取的路网信息
 */
export function getRoadListByRegion(region_id) {
  // 向服务器发送GET请求，获取指定区域的路网信息
  return request({
    url: '/api/road/', // 请求的API路径
    method: 'get', // 使用GET方法请求
    params: {
      region_id: region_id, // 将区域ID作为查询参数传递
    },
  })
}

/**
 * 获取路网信息
 * 本函数通过向服务器发送GET请求来获取路网数据。
 * 
 * @returns {Promise} 返回一个Promise对象，成功时携带路网信息，失败时携带错误信息。
 */
export function getRoadList() {
  // 发送GET请求获取路网信息
  return request({
    url: '/api/road/', // 请求的API路径
    method: 'get', // 使用GET方法请求
  })
}
import request from '@/utils/request'

/**
 * 根据区域ID获取盒子列表
 * @param {number} region_id - 区域的ID标识
 * @return {Promise} 返回一个Promise对象，成功时携带从服务器获取的盒子列表信息
 */
export function getBoxListByRegion(region_id) {
    // 向服务器发送GET请求，获取指定区域ID的盒子列表
    return request({
        url: '/api/box/', // 请求的API路径
        method: 'get', // 请求方法为GET
        params: {
            region_id: region_id // 将区域ID作为参数传递
        }
    })
}

/**
 * 根据道路ID获取盒子列表
 * @param {String} road_id - 道路的唯一标识符
 * @returns {Promise} 返回一个Promise对象，成功时携带从服务器获取的盒子列表
 */
export function getBoxListByRoad(road_id) {
    // 向服务器发送GET请求以获取特定道路ID的盒子列表
    return request({
        url: '/api/box/', // 指定请求的API路径
        method: 'get', // 使用GET方法请求
        params: {
            road_id: road_id // 将道路ID作为参数进行传递
        }
    })
}

/**
 * 获取指定ID的盒子信息
 * 
 * @param {string} box_id - 盒子的唯一标识符
 * @return {Promise} 返回一个Promise对象，成功时携带盒子信息
 */
export function getBox(box_id) {
    // 使用请求函数请求盒子信息
    return request({
        url: '/api/box/' + box_id, // 构造请求的API路径
        method: 'get' // 请求方法为GET
    })
}

/**
 * 删除指定的盒子
 * 
 * @param {string} box_id - 需要删除的盒子的ID。
 * @returns 返回一个Promise对象，成功时携带删除操作的结果，失败时携带错误信息。
 */
export function deleteBox(box_id) {
    // 发送DELETE请求以删除指定ID的盒子
    return request({
        url: '/api/box/' + box_id, // 构造请求URL
        method: 'delete' // 设置请求方法为DELETE
    })
}

/**
 * 更新指定ID的盒子信息
 * @param {string} box_id - 盒子的唯一标识符
 * @param {Object} DTO - 数据传输对象，包含要更新的盒子信息
 * @returns 返回一个Promise对象，它解析为请求的结果
 */
export function updateBox(box_id, DTO) {
    // 使用请求函数发送PUT请求以更新盒子信息
    return request({
        url: '/api/box/' + box_id, // 根据提供的box_id构造请求的URL
        method: 'put', // 设置请求方法为PUT
        data: DTO // 将DTO对象作为请求体发送
    })
}

/**
 * 设置指定ID的盒子信息
 * @param {string} box_id - 盒子的唯一标识符
 * @param {Object} DTO - 数据传输对象，包含要设置的盒子信息
 * @returns 返回一个Promise对象，它解析为请求的响应
 */
export function setBox(box_id, DTO) {
    // 构造请求URL并发送POST请求以设置盒子信息
    return request({
        url: '/api/box/' + box_id, // 使用提供的box_id构造请求的URL
        method: 'post', // 指定请求方法为POST
        data: DTO // 将DTO对象作为请求的数据体发送
    })
}

export function addBox(DTO) {
    return request({
        url: '/api/box/',
        method: 'post',
        data: DTO
    })
}
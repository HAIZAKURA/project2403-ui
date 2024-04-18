import request from '@/utils/request'

/**
 * 删除用户区域信息
 * @param {Object} DTO - 数据传输对象，包含要删除的用户区域信息
 * @returns {Promise} 返回一个Promise对象，用于处理请求的结果
 */
export function deleteUserRegion(DTO) {
    // 发起删除用户区域的HTTP DELETE请求
    return request({
        url: '/api/user_region',
        method: 'delete',
        data: DTO
    })
}

/**
 * 向服务器添加用户区域信息
 * @param {Object} DTO 数据传输对象，包含要添加的用户区域信息
 * @returns 返回一个Promise对象，用于处理请求的结果
 */
export function addUserRegion(DTO) {
    // 发起添加用户区域的HTTP POST请求
    return request({
        url: '/api/user_region',
        method: 'post',
        data: DTO
    })
}
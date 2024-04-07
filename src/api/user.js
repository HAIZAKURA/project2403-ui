import request from '@/utils/request'

/**
 * 用户登录接口
 * @param {Object} LoginDTO - 登录数据传输对象，包含登录所需信息
 * @returns {Promise} 返回一个Promise对象，用于处理登录请求的结果
 */
export function userLogin(LoginDTO) {
  // 发送登录请求
  return request({
    url: '/api/user/login',
    method: 'post',
    data: LoginDTO
  })
}

/**
 * 用户登出功能
 * 本函数用于向服务器发送登出请求，完成用户登出操作。
 *
 * @returns {Promise} 返回一个Promise对象，成功时返回登出操作的结果，失败时返回错误信息。
 */
export function userLogout() {
  // 发送登出请求
  return request({
    url: '/api/user/logout',
    method: 'get'
  })
}

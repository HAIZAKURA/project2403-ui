import request from '@/utils/request'

/**
 * 用户登录接口
 * @param {Object} LoginDTO - 登录数据传输对象，包含登录所需信息
 * @returns {Promise} 返回一个Promise对象，用于处理登录请求的结果
 */
export function userLogin(LoginDTO) {
  // 发送登录请求
  return request({
    url: '/api/login',
    method: 'post',
    data: LoginDTO
  })
}

/**
 * 刷新令牌
 * @returns {Promise} 返回一个Promise对象，成功时携带刷新后的令牌信息，失败时携带错误信息。
 */
export function refreshToken() {
  // 向指定URL发送GET请求以刷新令牌
  return request({
    url: '/api/refresh',
    method: 'get'
  })
}

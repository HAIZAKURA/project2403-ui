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

/**
 * 获取用户列表 
 * @returns {Promise} 返回一个Promise对象，成功时携带用户列表数据。
 */
export function getUserList() {
  // 发起GET请求获取用户列表
  return request({
    url: '/api/user',
    method: 'get'
  })
}

/**
 * 获取指定用户的信息
 * @param {String} uid 用户的唯一标识符
 * @returns 返回一个Promise对象，成功时携带获取到的用户信息
 */
export function getUser(uid) {
  // 发起GET请求获取指定用户信息
  return request({
    url: '/api/user/' + uid,
    method: 'get'
  })
}

/**
 * 创建用户
 * @returns {Promise} 返回一个Promise对象，成功时携带创建的用户信息，失败时携带错误信息
 */
export function createUser(userDTO) {
  // 使用request函数发送POST请求创建用户
  return request({
    url: '/api/user',
    method: 'post',
    data: userDTO
  })
}

/**
 * 删除用户
 * @param {String} uid 用户唯一标识符
 * @returns 返回一个请求Promise对象，用于删除指定ID的用户
 */
export function deleteUser(uid) {
  // 发送删除用户的请求
  return request({
    url: '/api/user/' + uid, // 构造请求的URL，指定要删除的用户ID
    method: 'delete' // 使用HTTP的DELETE方法发起删除请求
  })
}

/**
 * 恢复用户
 * @param {String} uid 用户唯一标识符
 * @returns 返回一个请求Promise对象，用于恢复指定ID的用户
 */
export function recoverUser(uid) {
  // 发送恢复用户的请求
  return request({
    url: '/api/user/' + uid, // 构造请求的URL，指定要恢复的用户ID
    method: 'put' // 使用HTTP的PUT方法发起恢复请求
  })
}

/**
 * 更新用户密码
 * @param {string} uid 用户ID，用于指定要更新密码的用户
 * @param {Object} passDTO 数据传输对象，包含新密码等信息
 * @return {Promise} 返回一个Promise对象，成功时携带更新结果，失败时携带错误信息
 */
export function renewPass(uid, passDTO) {
  // 发起POST请求，更新指定用户的密码
  return request({
    url: '/api/user/' + uid, // 构造请求的URL，指定用户ID
    method: 'post', // 使用POST方法更新数据
    data: passDTO // 将passDTO对象作为请求的数据体发送
  })
}

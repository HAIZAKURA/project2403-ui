import axios from 'axios'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // url = base url + request url
  timeout: 5000 // request timeout
})

request.defaults.withCredentials = true

// 添加请求拦截器
request.interceptors.request.use((config) => {
    // 尝试从localStorage获取token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default request

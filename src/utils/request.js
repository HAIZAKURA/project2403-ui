import axios from 'axios'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // url = base url + request url
  timeout: 5000 // request timeout
})

request.defaults.withCredentials = true

export default request

import axios from 'axios'
import type { ApiResponse } from '@/types'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
})

request.interceptors.response.use(
  (response) => response.data as ApiResponse,
  (error) => Promise.reject(error),
)

export default request

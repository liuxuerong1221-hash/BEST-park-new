// 全局类型定义
// 后续根据设计稿和接口文档逐步补充

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

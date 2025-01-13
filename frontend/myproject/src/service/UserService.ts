import type { UserDto } from "@/types/User.dto"
import axios from "axios"

// Axios 인스턴스 생성
const adminClient = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_BACKEND_URL,
  withCredentials: true, // HTTP-only 쿠키를 전송하려면 설정 필요
})
export const userService = {

  // 사용자 조회 - userId
  getUserAuthById: async (userId: string): Promise<UserDto> => {
    try {
      const response = await adminClient.get<UserDto>(`/users/userAuth/${userId}`)
      return response.data
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || '사용자 조회 중 오류가 발생하였습니다.')
      } else {
        throw new Error('알 수 없는 오류가 발생하였습니다.')
      }
    }
  },
}

import sootechAxios from '@/plugins/SootechAxios'
import type { UserDto } from '@/types/user/User.dto'
import axios from 'axios'

export const userService = {
  // 사용자 조회 - userSn
  getUserBySn: async (userSn: string): Promise<UserDto> => {
    try {
      const response = await sootechAxios.get<UserDto>(`/users/${userSn}`)
      return response.data
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || '사용자 조회 중 오류가 발생하였습니다.')
      } else {
        throw new Error('알 수 없는 오류가 발생하였습니다.')
      }
    }
  },
  // 사용자 정보 수정
  updateUser: async (userSn: string, userDto: UserDto): Promise<UserDto> => {
    try {
      const response = await sootechAxios.put<UserDto>(`/users/${userSn}`, userDto)
      return response.data
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || '사용자 정보 수정 중 오류가 발생하였습니다.')
      } else {
        throw new Error('알 수 없는 오류가 발생하였습니다.')
      }
    }
  },
  // 사용자 탈퇴
  withdrawUser: async (userSn: string): Promise<void> => {
    try {
      await sootechAxios.put<void>(`/users/${userSn}/withdraw`)
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || '사용자 탈퇴 중 오류가 발생하였습니다.')
      } else {
        throw new Error('알 수 없는 오류가 발생하였습니다.')
      }
    }
  },
  // 로그인 유저 정보 조회
  getCurrentUser: async (): Promise<UserDto> => {
    try {
      const response = await sootechAxios.get<UserDto>('/users/me')
      return response.data
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || '로그인 사용자 정보 조회 중 오류가 발생하였습니다.')
      } else {
        throw new Error('알 수 없는 오류가 발생하였습니다.')
      }
    }
  },
}

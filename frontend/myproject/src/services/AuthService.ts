import publicAxios from '@/plugins/PublicAxios'
import type { TokenDto } from '@/types/token/Token.dto'
import type { UserDto } from '@/types/user/User.dto'
import axios, { AxiosError } from 'axios'

export const authService = {
  login: async (userDto: UserDto): Promise<TokenDto> => {
    try {
      const response = await publicAxios.post<TokenDto>('/auth/login', userDto)
      const tokenDto = response.data
      return tokenDto
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>
        const errorMessage = axiosError.response?.data?.message || '로그인 중 오류가 발생하였습니다.'
        throw new Error(errorMessage) // 백엔드에서 받은 메시지 그대로 throw
      } else {
        throw new Error('알 수 없는 오류가 발생하였습니다.')
      }
    }
  },
  logout: async (): Promise<void> => {
    try {
      await publicAxios.post<void>('/auth/logout')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message || '로그아웃 중 에러가 발생하였습니다.')
      } else {
        throw new Error('알 수 없는 오류')
      }
    }
  },
}

import { defineStore } from 'pinia'
import type { UserDto } from '@/types/user/User.dto'
import type { TokenDto } from '@/types/token/Token.dto'

export const useAuthorityStore = defineStore('auth', {
  state: () => ({
    userDto: null as UserDto | null,
    tokenDto: null as TokenDto | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.tokenDto,
    allAuthorities: (state) => state.userDto?.allAuthrtDtoSet ?? [],
  },
  actions: {
    /**
     * 백엔드 로그인 성공 후 사용자 및 토큰 정보를 저장
     */
    login(userDto: UserDto, tokenDto: TokenDto) {
      this.userDto = userDto
      this.tokenDto = tokenDto
debugger
      // 로컬 스토리지에 저장
      localStorage.setItem('user', JSON.stringify(userDto))
      localStorage.setItem('token', tokenDto.token)
    },
    /**
     * 사용자 정보를 갱신
     */
    updateUser(newUserDto: UserDto) {
      this.userDto = newUserDto
      localStorage.setItem('user', JSON.stringify(newUserDto))
    },
    /**
     * 로그아웃 처리
     */
    logout() {
      this.userDto = null
      this.tokenDto = null
debugger
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
  },
})

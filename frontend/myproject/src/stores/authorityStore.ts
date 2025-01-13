

import type { UserAuthDto } from '@/types/Userauth.dto'
import { defineStore } from 'pinia'

export const useAuthorityStore = defineStore('auth', {
  state: () => ({
    userAuth: null as UserAuthDto | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.userAuth,
    allAuthorities: (state) => state.userAuth?.allAuthrtDtoSet ?? [],
  },
  actions: {
    /**
     * 로컬 스토리지에서 사용자 정보 복원
     */
    loadUserAuth() {
      const storedUserAuth = localStorage.getItem('userAuth')
      if (storedUserAuth) {
        try {
          this.userAuth = JSON.parse(storedUserAuth) as UserAuthDto
        } catch (error) {
          console.error('Failed to parse stored userAuth:', error)
          this.userAuth = null
        }
      }
    },
    /**
     * 백엔드 로그인 성공 후 사용자 정보를 저장
     */
    storeUserAuth(userAuth: UserAuthDto) {
      this.userAuth = userAuth
      // 로컬 스토리지에 사용자 정보 저장
      localStorage.setItem('userAuth', JSON.stringify(userAuth))
    },
    /**
     * 사용자 정보를 갱신
     */
    updateUser(userAuth: UserAuthDto) {
      this.userAuth = userAuth
      localStorage.setItem('userAuth', JSON.stringify(userAuth))
    },
    /**
     * 로그아웃 처리
     */
    removeUserAuth() {
      this.userAuth = null
      localStorage.removeItem('userAuth')
    },
  },
})


import type { TokenResponseUserDto } from '@/types/token.response.user.dto copy';
import { defineStore } from 'pinia';

export const useAuthorityStore = defineStore('auth', {
  state: () => ({
    user: null as TokenResponseUserDto | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    allAuthorities: (state) => state.user?.authorities ?? [],
  },
  actions: {
    /**
     * 백엔드 로그인 성공 후 사용자 정보를 저장
     */
    login(tokenResponseUserDto: TokenResponseUserDto) {
      this.user = tokenResponseUserDto;
      // 로컬 스토리지에 사용자 정보 저장
      //localStorage.setItem('user', JSON.stringify(userDto));
    },
    /**
     * 사용자 정보를 갱신
     */
    updateUser(newTokenResponseUserDto: TokenResponseUserDto) {
      this.user = newTokenResponseUserDto;
      //localStorage.setItem('user', JSON.stringify(newUserDto));
    },
    /**
     * 로그아웃 처리
     */
    logout() {
      this.user = null;
      //localStorage.removeItem('user');
    },
  },
});

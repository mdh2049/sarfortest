import type { UserDto } from '@/types/User.dto';
import { defineStore } from 'pinia';

export const useAuthorityStore = defineStore('auth', {
  state: () => ({
    userInfo: null as UserDto | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.userInfo,
    allAuthorities: (state) => state.userInfo?.allAuthrtDtoSet ?? [],
  },
  actions: {
    /**
     * 백엔드 로그인 성공 후 사용자 정보를 저장
     */
    login(userDto: UserDto) {
      this.userInfo = userDto;
      // 로컬 스토리지에 사용자 정보 저장
      //localStorage.setItem('user', JSON.stringify(userDto));
    },
    /**
     * 사용자 정보를 갱신
     */
    updateUser(newUserDto: UserDto) {
      this.userInfo = newUserDto;
      //localStorage.setItem('user', JSON.stringify(newUserDto));
    },
    /**
     * 로그아웃 처리
     */
    logout() {
      this.userInfo = null;
      //localStorage.removeItem('user');
    },
  },
});

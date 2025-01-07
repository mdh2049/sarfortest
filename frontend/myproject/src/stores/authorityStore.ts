import type { UserDto } from '@/types/User.dto';
import { defineStore } from 'pinia';

export const useAuthorityStore = defineStore('auth', {
  state: () => ({
    user: null as UserDto | null,
    accessToken: null as string | null, // 메모리에만 저장
  }),
  actions: {
    setAccessToken(token: string) {
      this.accessToken = token;
    },
    clearAccessToken() {
      this.accessToken = null;
    },
    login(user: UserDto, token: string) {
      this.user = user;
      this.setAccessToken(token);
      sessionStorage.setItem('accessToken', token);
    },
    logout() {
      this.user = null;
      this.clearAccessToken();
      sessionStorage.removeItem('accessToken');
    },
  },
});

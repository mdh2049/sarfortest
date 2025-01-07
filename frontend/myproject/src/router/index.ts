import { useAuthorityStore } from '@/stores/authorityStore'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/U/a4bc85889c8d',
      name: 'a4bc85889c8d',
      component: () => import('../views/Screena4bc85889c8dView.vue'),
    },
    {
      path: '/R/d0fd8cff6907',
      name: 'd0fd8cff6907',
      component: () => import('../views/Screend0fd8cff6907View.vue'),
    },
    {
      path: '/C/ddfca83c088a',
      name: 'ddfca83c088a',
      component: () => import('../views/Screenddfca83c088aView.vue'),
    },
    {
      path: '/L/f94b8a9b7919',
      name: 'f94b8a9b7919',
      component: () => import('../views/Screenf94b8a9b7919View.vue'),
    },

  ],
})
router.beforeEach(async (to, from, next) => {
  const authorityStore = useAuthorityStore();

  try {debugger
    // URL에서 Authorization Code 추출
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!code) {
      // Authorization Code가 없는 경우 로그인 페이지로 리다이렉트
      const redirectUrl = encodeURIComponent(window.location.origin + to.fullPath);
      const loginUrl = `${import.meta.env.VITE_ADMIN_FRONT_URL}login-user?redirect_uri=${redirectUrl}`;
      window.location.href = loginUrl;
      return;
    }

    // Access Token 요청
    const tokenResponse = await fetch(`${import.meta.env.VITE_ADMIN_BACKEND_URL}auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        redirectUri: window.location.origin + to.fullPath,
      }),
    });

    if (!tokenResponse.ok) throw new Error('Failed to fetch Access Token');

    const { accessToken } = await tokenResponse.json();

    // 사용자 정보 요청 (Authorization 헤더로 전달)
    const userAuthroity = await fetch(`${import.meta.env.VITE_ADMIN_BACKEND_URL}users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((response) => {
      if (!response.ok) throw new Error('Failed to fetch user information');
      return response.json();
    });

    authorityStore.login(userAuthroity);
    next();
  } catch (error) {
    console.error('Authentication failed:', error);
    const redirectUrl = encodeURIComponent(window.location.origin + to.fullPath);
    const loginUrl = `${import.meta.env.VITE_ADMIN_FRONT_URL}login-user?redirect_uri=${redirectUrl}`;
    window.location.href = loginUrl;
  }
});



export default router

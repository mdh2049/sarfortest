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

// 라우터 가드 설정
router.beforeEach(async (to, from, next) => {
  const authorityStore = useAuthorityStore();
  debugger;
  try {
    // URL에서 Authorization Code 추출
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!code) {
      // Authorization Code가 없는 경우 로그인 페이지로 리다이렉트
      const redirectUrl = encodeURIComponent(window.location.origin);
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
        redirectUri: window.location.origin,
      }),
    });

    if (!tokenResponse.ok) throw new Error('Failed to fetch Access Token');

    const { accessToken } = await tokenResponse.json();

    // 사용자 정보 요청 (userSn으로 조회)
    const userSn = await fetchUserSn(accessToken); // Access Token으로 userSn 가져오기

    // userSn으로 사용자 정보 조회
    const userResponse = await fetch(`${import.meta.env.VITE_ADMIN_BACKEND_URL}users/${userSn}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) throw new Error('Failed to fetch user information');

    const userDto = await userResponse.json();

    // Pinia Store에 사용자 정보 저장
    authorityStore.login(userDto);

    // 라우팅 진행
    next();
  } catch (error) {
    console.error('Authentication failed:', error);

    // 로그인 페이지로 리다이렉트
    const redirectUrl = encodeURIComponent(window.location.origin);
    const loginUrl = `${import.meta.env.VITE_ADMIN_FRONT_URL}login-user?redirect_uri=${redirectUrl}`;
    window.location.href = loginUrl;
  }
});


// 사용자 정보 요청 (Authorization 헤더로 전달)
const fetchUserSn = async (accessToken: string): Promise<string> => {
  try {
    // 사용자 정보 요청
    const response = await fetch(`${import.meta.env.VITE_ADMIN_BACKEND_URL}users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      // 응답이 실패했을 경우 에러 처리
      throw new Error('Failed to fetch user information');
    }

    const userInfo = await response.json();

    // userSn 값 반환
    if (!userInfo.userSn) {
      throw new Error('userSn is missing in the response');
    }

    console.log('Fetched userSn:', userInfo.userSn); // 디버깅용 로그
    return userInfo.userSn;

  } catch (error) {
    console.error('Error fetching user information:', error);
    throw error; // 에러를 다시 던져 상위에서 처리
  }
};


export default router

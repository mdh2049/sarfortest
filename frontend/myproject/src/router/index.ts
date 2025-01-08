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
  try {
    // 서버에 토큰 유효성 확인 요청 - 토큰이 유효하다면 userSn을 리턴
    const authorizedUserSn = await checkAuthStatus();

    if (authorizedUserSn) {
      // Pinia에 사용자 정보가 없는 경우 복원
      if (!authorityStore.user) {
        await fetchAndStoreUserInfo(authorizedUserSn);
      }

      // 라우팅 진행
      next();
      return;
    }

    // URL에서 Authorization Code 추출 - code grant flow
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!code) {
      // Authorization Code가 없는 경우 로그인 페이지로 리다이렉트
      redirectToLogin();
      return;
    }

    // Authorization Code를 사용해 Access Token 요청 - 토큰 생성 후후 userSn을 리턴
    const newUserSn = await requestAccessToken(code);

    // 사용자 정보 요청 및 저장
    await fetchAndStoreUserInfo(newUserSn);

    // 라우팅 진행
    next();
  } catch (error) {
    console.error('Authentication failed:', error);

    // Refresh Token으로 Access Token 갱신 시도
    try {
      const renewUserSn = await refreshAccessToken();
      if (!authorityStore.user) {
        await fetchAndStoreUserInfo(renewUserSn);
      }
      // 라우팅 진행
      next();
    } catch (refreshError) {
      console.error('Failed to refresh Access Token:', refreshError);
      redirectToLogin();
    }
  }
});
// Authorization Code를 사용해 Access Token 요청
const requestAccessToken = async (code: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_ADMIN_BACKEND_URL}auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        redirectUri: window.location.origin,
      }),
      credentials: 'include', // 쿠키 포함 요청
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Access Token');
    }

    const { userSn } = await response.json();
    return userSn;
  } catch (error) {
    console.error('Error requesting Access Token:', error);
    throw error;
  }
};

// Refresh Token으로 Access Token 갱신
const refreshAccessToken = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_ADMIN_BACKEND_URL}auth/refresh-token`, {
      method: 'POST',
      credentials: 'include', // 쿠키 포함 요청
    });

    if (!response.ok) {
      throw new Error('Failed to refresh Access Token');
    }

    const { userSn } = await response.json();
    return userSn;
  } catch (error) {
    console.error('Error refreshing Access Token:', error);
    throw error;
  }
};

// 서버에서 인증 상태 확인
const checkAuthStatus = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_ADMIN_BACKEND_URL}auth/check`, {
      method: 'GET',
      credentials: 'include', // 쿠키 포함 요청
    });

    if (response.ok) {
      const { userSn } = await response.json();
      return userSn;
    }

    return false;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    throw error;
  }
};


// 사용자 정보 요청 및 저장
const fetchAndStoreUserInfo = async (userSn: string) => {
  try {
    const authorityStore = useAuthorityStore();
    const userResponse = await fetch(`${import.meta.env.VITE_ADMIN_BACKEND_URL}users/${userSn}`, {
      method: 'GET',
      credentials: 'include', // 쿠키 포함 요청
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user information');
    }

    const userDto = await userResponse.json();
    authorityStore.login(userDto);
  } catch (error) {
    console.error('Error fetching and storing user information:', error);
    throw error;
  }
};



// 로그인 페이지로 리다이렉트
const redirectToLogin = () => {
  try {
    const redirectUrl = encodeURIComponent(window.location.href);
    const loginUrl = `${import.meta.env.VITE_ADMIN_FRONT_URL}login-user?redirect_uri=${redirectUrl}`;
    window.location.href = loginUrl;
  } catch (error) {
    console.error('Error redirecting to login:', error);
    throw error;
  }
};



export default router

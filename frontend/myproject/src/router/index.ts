import { useAuthorityStore } from '@/stores/authorityStore'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import type { AxiosError } from 'axios';

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
    // Pinia에 Access Token 확인
    let accessToken = authorityStore.accessToken || sessionStorage.getItem('accessToken');
    if (accessToken) {
      // Pinia에 사용자 정보가 없는 경우 복원
      if (!authorityStore.user) {
        await fetchAndStoreUserInfo(accessToken);
      }

      // 라우팅 진행
      next();
      return;
    }

    // URL에서 Authorization Code 추출
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!code) {
      // 인증 코드가 없는 경우 로그인 페이지로 리다이렉트
      redirectToLogin();
      return;
    }

    // Access Token 요청
    accessToken = await requestAccessToken(code);

    // Access Token 저장
    if (accessToken) {
      authorityStore.setAccessToken(accessToken);

      // 사용자 정보 요청 및 저장
      await fetchAndStoreUserInfo(accessToken);
    } else {
      throw new Error('Access Token is null');
    }
    // 라우팅 진행
    next();
  } catch (error) {
    console.error('Authentication failed:', error);

    if (isAxiosError(error) && error.response?.status === 401) {
      try {
        // Refresh Token으로 Access Token 갱신
        const refreshToken = getRefreshTokenFromCookie();
        const { accessToken: newAccessToken } = await fetchAccessToken(refreshToken);

        authorityStore.setAccessToken(newAccessToken);

        // 사용자 정보 요청 및 저장
        await fetchAndStoreUserInfo(newAccessToken);

        // 라우팅 진행
        next();
        return;
      } catch (refreshError) {
        console.error('Failed to refresh Access Token:', refreshError);
      }
    }

    // 최종적으로 로그인 페이지로 리다이렉트
    redirectToLogin();
  }
});



// Axios 에러 타입 가드
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError !== undefined;
}

// userSn 요청
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

async function fetchAndStoreUserInfo(accessToken: string) {
  const authorityStore = useAuthorityStore();
  const userSn = await fetchUserSn(accessToken);

  const userResponse = await fetch(`${import.meta.env.VITE_ADMIN_BACKEND_URL}users/${userSn}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!userResponse.ok) throw new Error('Failed to fetch user information');

  const userDto = await userResponse.json();
  authorityStore.login(userDto, accessToken);
}

// Access Token 요청
async function requestAccessToken(code: string): Promise<string> {
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
  return accessToken;
}

// Refresh Token으로 Access Token 갱신
async function fetchAccessToken(refreshToken: string) {
  const response = await fetch(`${import.meta.env.VITE_ADMIN_BACKEND_URL}auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) throw new Error('Failed to refresh Access Token');
  return await response.json();
}

// Refresh Token 가져오기
function getRefreshTokenFromCookie() {
  const cookies = document.cookie.split(';');
  const refreshToken = cookies.find((cookie) => cookie.trim().startsWith('refreshToken='));
  if (!refreshToken) throw new Error('Refresh Token not found');
  return refreshToken.split('=')[1];
}

// 로그인 페이지로 리다이렉트
function redirectToLogin() {
  const redirectUrl = encodeURIComponent(window.location.origin);
  const loginUrl = `${import.meta.env.VITE_ADMIN_FRONT_URL}login-user?redirect_uri=${redirectUrl}`;
  window.location.href = loginUrl;
}



export default router

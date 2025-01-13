import { useAuthorityStore } from '@/stores/authorityStore'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import type { AuthorityDto } from '@/types/authority.dto'
import { loginService } from '@/service/LoginService'
import { userService } from '@/service/UserService'

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

//라우터 가드 설정
router.beforeEach(async (to, from, next) => {
  const authorityStore = useAuthorityStore()

  try {
    // 토큰 유효성 검사
    const responseValidate = await loginService.validateAuth()
    const userId = responseValidate.userId
    const isAuthenticated = responseValidate.isAuthenticated
    if (isAuthenticated) {
      // 로컬 스토리지에서 사용자 권한 정보 로드
      authorityStore.loadUserAuth()

      // 권한 정보가 없는 경우 서버에서 가져오기
      if (!authorityStore.isAuthenticated && userId) {
        const userAuthDto = await userService.getUserAuthById(userId)
        authorityStore.storeUserAuth(userAuthDto)

        if (!checkAdminAuthority(authorityStore)) {
          alert('관리자 권한이 없습니다. 로그인 페이지로 이동합니다.')
          loginService.logout()
          authorityStore.removeUserAuth() // 권한 초기화
          loginService.redirectToLogin()
          return
        }
      }
      next()

      return
    }

    // Access Token과 Refresh Token이 없는 경우 Authorization Code 확인
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')

    if (!code) {
      loginService.redirectToLogin() // Authorization Code도 없는 경우 로그인 페이지로 리다이렉트
      return
    }

    // Authorization Code를 사용해 토큰 발급 및 권한 저장
    const responseToken = await loginService.requestAccessToken(code)
    const userIdFromToken = responseToken.userId
    const userAuthDto = await userService.getUserAuthById(userIdFromToken)
    authorityStore.storeUserAuth(userAuthDto)

    if (!checkAdminAuthority(authorityStore)) {
      alert('관리자 권한이 없습니다. 로그인 페이지로 이동합니다.')
      await fetch(`${import.meta.env.VITE_LOGIN_BACKEND_URL}auth/logout`, {
        method: 'POST',
        credentials: 'include', // 쿠키 포함 요청
      })
      authorityStore.removeUserAuth() // 권한 초기화
      loginService.redirectToLogin()
      return
    }

    next('/') // 인증 후 기본 경로로 리다이렉트
  } catch (error) {
    console.error('Authentication failed:', error)
    authorityStore.removeUserAuth() // 권한 초기화
    loginService.redirectToLogin()
  }
})

//관리자 권한 체크
const checkAdminAuthority = (authorityStore: ReturnType<typeof useAuthorityStore>): boolean => {
  return authorityStore.allAuthorities.some((authority: AuthorityDto) => authority.authrtNm === 'ROLE_ADMIN')
}


export default router

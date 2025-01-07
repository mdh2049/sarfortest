import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthorityStore } from '@/stores/authorityStore'
import { JwtUtils } from '@/utils/JwtUtils'
import { userService } from '@/services/UserService'

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
router.beforeEach(async (to, from, next) => {debugger
  const authorityStore = useAuthorityStore()
  // 쿠키에서 토큰 문자열 가져오기
  const tokenString = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];

  // JSON.parse로 토큰 객체 변환
  const token = tokenString ? JSON.parse(decodeURIComponent(tokenString)) : null;
  const exp = JwtUtils.getExpFromToken(token)

  if (!token || !token.token || JwtUtils.isTokenExpired(exp)) {
    // 만료된 토큰 삭제
    document.cookie = 'token=; Max-Age=0; Path=/';
    // 관리자 서버 로그인 페이지로 리다이렉트
    const redirectUrl = encodeURIComponent(window.location.origin + to.fullPath)
    const adminLoginUrl = `${import.meta.env.VITE_ADMIN_FRONT_URL}login-user?redirect_uri=${redirectUrl}`
    window.location.href = adminLoginUrl
    return
  }else{
    debugger
    authorityStore.login({},token)
    const userSn = JwtUtils.getJwtUserInfoFromToken(token).userSn
    const userAuthroity = await userService.getUserBySn(userSn)
    authorityStore.login(userAuthroity,token)
    next()
  }
})

export default router

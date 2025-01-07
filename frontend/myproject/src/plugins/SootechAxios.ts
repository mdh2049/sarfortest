import { useAuthorityStore } from '@/stores/authorityStore'
import { JwtUtils } from '@/utils/JwtUtils'
import axios, { isAxiosError } from 'axios'

// Axios 인스턴스 생성
const instance = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_BACKEND_URL,
})


instance.interceptors.request.use(
  (config) => {debugger
    const authorityStore = useAuthorityStore(); // Pinia 스토어 인스턴스
    // 로컬 스토리지에서 토큰 가져오기
    const tokenDto = authorityStore.tokenDto
    if (tokenDto) {
      // 토큰 만료 여부 확인
      const exp = JwtUtils.getExpFromToken(tokenDto)
      if (JwtUtils.isTokenExpired(exp)) {
        JwtUtils.handleTokenExpiration() // 만료 시 처리
        return Promise.reject(new Error('Token expired')) // 요청 취소
      }
      // 유효한 토큰인 경우 Authorization 헤더에 추가
      config.headers['Authorization'] = `Bearer ${tokenDto.token}`
    } else {
      // 토큰이 없는 경우 Pinia를 사용하여 상태 초기화
      authorityStore.logout();
    }
    return config
  },
  (error) => {
    // 요청 에러 처리
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  (response) => {debugger
    return response
  },
  (error) => {
    if (!isAxiosError(error)) {
      return Promise.reject(error)
    }
    if (error.response) {
      switch (error.response.status) {
        case 401: // Unauthorized: 토큰 만료 또는 인증 실패
        JwtUtils.handleTokenExpiration() // 만료 시 처리
          break
        case 500:
          console.error('Server error', error.response.data.message)
          break
        default:
          console.error('Unexpected error occurred.', error.toJSON())
          break
      }
    }
    return Promise.reject(error)
  },
)

export default instance

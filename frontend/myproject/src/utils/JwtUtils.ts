import { authService } from '@/services/AuthService'
import { useAuthorityStore } from '@/stores/authorityStore'
import type { DecodedToken } from '@/types/token/DecodedToken.dto'
import type { TokenDto } from '@/types/token/Token.dto'

/**
 * JWT를 'header.payload.signature' 구조로 가정하고 payload 부분 디코딩
 */
const decodeJwtPayload = (tokenDto: TokenDto): DecodedToken | null => {
  if (!tokenDto) return null
  try {
    const parts = tokenDto.token.split('.')
    if (parts.length !== 3) {
      console.error('Invalid token format: missing parts')
      return null
    }
    const payloadBase64 = parts[1]
    return JSON.parse(atob(payloadBase64))
  } catch (error) {
    console.error('Invalid token format:', error)
    return null
  }
}

/**
 * 필요한 사용자 정보만 뽑아서 반환
 */
interface JwtUserInfo {
  userId: string
  userSn: string
}

const getJwtUserInfoFromToken = (tokenDto: TokenDto): JwtUserInfo => {
  if (!tokenDto) {
    throw new Error('Token not found')
  }

  const payload = decodeJwtPayload(tokenDto)
  if (!payload || !payload.sub || !payload.userSn) {
    throw new Error('Invalid JWT token')
  }

  return { userId: payload.sub, userSn: payload.userSn }
}

/**
 * 토큰에서 만료 시간 추출
 */
const getExpFromToken = (tokenDto: TokenDto): number | null => {
  if (!tokenDto) return null
  const payload = decodeJwtPayload(tokenDto)
  return payload?.exp ?? null
}

/**
 * 만료 여부 판단
 */
const isTokenExpired = (exp: number | null): boolean => {
  if (!exp) return true
  return Date.now() >= exp * 1000
}

/**
 * 토큰 만료 시 처리 (로그아웃 + alert)
 */
const handleTokenExpiration = (): void => {
  const authorityStore = useAuthorityStore()
  authorityStore.logout()
  authService.logout()
  document.cookie = 'token=; Max-Age=0; Path=/';
  alert('로그인이 만료되었습니다. 다시 로그인해주세요.')
  // 관리자 서버 로그인 페이지로 리다이렉트
  const redirectUrl = encodeURIComponent(window.location.origin)
  const adminLoginUrl = `${import.meta.env.VITE_ADMIN_FRONT_URL}login-user?redirect_uri=${redirectUrl}`
  window.location.href = adminLoginUrl
}

export const JwtUtils = {
  decodeJwtPayload,
  getJwtUserInfoFromToken,
  getExpFromToken,
  isTokenExpired,
  handleTokenExpiration,
}

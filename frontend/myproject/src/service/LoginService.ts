import axios from 'axios'
// Axios 인스턴스 생성
const loginClient = axios.create({
  baseURL: import.meta.env.VITE_LOGIN_BACKEND_URL,
  withCredentials: true, // HTTP-only 쿠키를 전송하려면 설정 필요
})

const loginApiURL = import.meta.env.VITE_LOGIN_FRONT_URL

export const loginService = {
  /**
   * 토큰 유효성 검사
   * @returns 유효성 검사 결과
   */
  validateAuth: async (): Promise<{ isAuthenticated: boolean; userId?: string }> => {
    try {
      const response = await loginClient.get('/auth/validate')
      if (response.status === 200) {
        return response.data
      }

      if (response.status === 401) {
        await loginService.refreshAccessToken()
        return { isAuthenticated: true }
      }

      throw new Error('Token validation failed')
    } catch (error) {
      console.error('Error validating token:', error)
      loginService.redirectToLogin()
      return { isAuthenticated: false }
    }
  },

  /**
   * Access Token 요청
   * @param code Authorization Code
   * @returns Access Token 데이터
   * @throws {Error} Access Token 요청 실패 시 에러를 던짐
   */
  requestAccessToken: async (code: string) => {
    try {
      const response = await loginClient.post('/auth/token', {
        code,
        redirectUri: window.location.origin,
      })

      if (!response || response.status !== 200) {
        throw new Error('Failed to fetch Access Token')
      }

      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'An error occurred while requesting Access Token')
      } else {
        throw new Error('Unknown error occurred while requesting Access Token')
      }
    }
  },
  /**
   * Access Token 갱신 요청
   * @throws {Error} Access Token 갱신 실패 시 에러를 던짐
   */
  refreshAccessToken: async (): Promise<void> => {
    try {
      const response = await loginClient.post('/auth/refresh-token')
      if (!response || response.status !== 200) {
        throw new Error('Failed to refresh Access Token')
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'An error occurred during token refresh')
      } else {
        throw new Error('Unknown error occurred during token refresh')
      }
    }
  },

  /**
   * 로그인 페이지로 리다이렉트
   */
  redirectToLogin: () => {
    // 현재 URL에서 기존 `code` 파라미터를 제거
    const currentUrl = loginService.cleanUrl(window.location.href)
    const redirectUrl = encodeURIComponent(currentUrl)
    window.location.href = `${loginApiURL}login-admin?redirect_uri=${redirectUrl}`
  },

  /**
   * URL에서 `code` 파라미터 제거
   * @param url URL 문자열
   * @returns `code` 파라미터가 제거된 URL
   */
  cleanUrl: (url: string): string => {
    try {
      const parsedUrl = new URL(url)
      parsedUrl.searchParams.delete('code') // 기존 `code` 파라미터 제거
      return parsedUrl.toString()
    } catch (error) {
      console.error('Error cleaning URL:', error)
      return url // 실패 시 원래 URL 반환
    }
  },

  /**
   * 서버 로그아웃 요청
   * @throws {Error} 서버 로그아웃 실패 시 에러를 던짐
   */
  logout: async (): Promise<void> => {
    try {
      const response = await loginClient.post('/auth/logout')
      if (!response || response.status !== 200) {
        throw new Error('Failed to log out from server')
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'An error occurred during logout')
      } else {
        throw new Error('Unknown error occurred during logout')
      }
    }
  },
}

export default loginClient

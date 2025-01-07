import axios from 'axios'

// 인증 없이 사용하는 Axios 인스턴스 생성 (회원가입 등)
const publicInstance = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_BACKEND_URL,
})

export default publicInstance

import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // server: {
  //   host: '192.168.0.50', // 사용할 로컬 네트워크 IP
  //   port: 5173,           // 기본 포트
  //   strictPort: true,     // 해당 포트가 사용 중일 경우 실패하도록 설정
  //   open: true,           // 브라우저 자동 열기
  // },
})

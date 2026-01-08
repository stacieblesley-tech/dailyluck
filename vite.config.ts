
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // 상대 경로로 설정하여 어디서든 파일을 찾을 수 있게 함
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    alias: {
      recharts: new URL('./src/__tests__/__mocks__/recharts.tsx', import.meta.url).pathname,
      'motion/react': new URL('./src/__tests__/__mocks__/motion-react.tsx', import.meta.url).pathname,
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/lib/**', 'src/context/**', 'src/components/**'],
      exclude: ['src/test/**', 'src/main.tsx'],
    },
  },
})

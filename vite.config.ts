import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

// 端口由 portless 注入（PORT / --port），不要在配置里写死，
// 否则框架落在另一个端口上时，代理会返回 502。
export default defineConfig({
  plugins: [tanstackStart(), viteReact()],
})

/**
 * @file Playwright 配置
 * @description 最小烟雾测试，内置 WebServer、端口与等待策略、快照目录
 * @author YYC
 * @created 2024-10-31
 */
import { defineConfig } from '@playwright/test'

const PORT = Number(process.env.PORT || 3005)

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    permissions: ['clipboard-read', 'clipboard-write'],
    storageState: { cookies: [], origins: [] },
  },
  // 启动服务器：CI 下使用生产模式（next start），本地用开发模式（next dev）
  webServer: {
    command: process.env.CI ? `npm run start -- -p ${PORT}` : `npm run dev -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    timeout: 60_000,
    reuseExistingServer: !process.env.CI,
  },
  snapshotPathTemplate: '{testDir}/__snapshots__/{testFile}-{projectName}-{hash}.png',
})

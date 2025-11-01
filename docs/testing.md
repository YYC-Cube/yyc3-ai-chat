# ✅ 测试与 CI 配置

## Playwright（E2E）

- 基本命令：`pnpm e2e`
- 配置（`playwright.config.ts`）：
  - `webServer`：本地使用 `npm run dev`，CI 使用 `npm run start`
  - `PORT`：默认 `3005`，通过 `process.env.PORT` 覆盖
  - `baseURL`：`http://localhost:${PORT}`
  - 截图与 Trace：`only-on-failure`、`retain-on-failure`

## 测试用例

- `home.spec.ts`：首页渲染与语言属性
- `health.spec.ts`：`GET /api/health` 返回基本指标
- `chat-create-send.spec.ts`：新建会话并发送消息（使用稳定 title 选择器：`新建会话 (⌘N)`）
- `theme-toggle.spec.ts`：主题切换（检查 `data-theme`）
- `sidebar-collapse.spec.ts`：侧边栏折叠与展开
- `alerts-test.spec.ts`：轻量校验（条件跳过）
  - 跳过条件：未配置任一 Slack 分组 Webhook 或 `NODE_ENV === 'production'`

## 单元测试（Jest）

- `lib/__tests__/i18n.test.tsx`：多语言基础能力（翻译、切换、变量与复数）

## CI 注意事项

- 在生产 CI 环境下，`alerts-test.spec.ts` 会跳过，避免产生无意义告警
- 若需要在 Staging 执行告警校验：
  - 设置 `NODE_ENV=development` 并确保任一分组 Webhook 已配置

## 重要建议

- 建议在 PR 合并前运行 `pnpm typecheck` 与 `pnpm e2e`，确保类型与关键路径测试稳定 🌹

# 🛠️ 故障排查

> 收录常见问题与处理步骤，提升定位与恢复效率。

## WebServer 启动失败

- 现象：E2E 启动失败或端口占用
- 排查：
  - 确认 `PORT` 未被占用：`lsof -i :3005`
  - CI 使用 `next start`；本地 `next dev`，避免模式不一致

## 告警测试跳过

- 现象：`alerts-test.spec.ts` 显示跳过
- 原因：生产环境或未配置任一分组 Slack Webhook
- 处理：在非生产环境设置至少一个 Webhook，并重试

## 类型检查错误

- 现象：`pnpm typecheck` 报 TS 语法/类型错误
- 排查：
  - 检查 `lib/api-health.ts` 是否存在残留 diff 标记或表达式缺分号
  - 验证 `monitorRoute` 选项对象是否完整与类型匹配

## 性能告警过多

- 现象：大量 `performance` 告警
- 排查：
  - 查看 `RouteHealth` 采样：是否 `p95 > 700ms` 或错误占比偏高
  - 针对路径临时提高 `performanceThresholdMs` 或切回 `normal`
  - 使用缓存（Redis）与索引优化（PostgreSQL）

## 依赖构建警告

- 现象：构建时提示关键依赖警告（如 `require-in-the-middle`）
- 处理：
  - 确认警告是否影响运行时；若仅为转译提示可暂不阻塞
  - 定期升级相关依赖，并在 CI 中验证

## 重要建议

- 对于不确定的异常行为，优先在 Staging 环境复现并启用分组告警通道，结合 `GET /api/health/advice` 的建议进行针对性优化 🌹

## React 19 + Next 15 RSC 异常排查与约束

- 现象：浏览器报错 `Cannot read properties of undefined (reading 'call')` 或资源 404
- 根因：RSC 边界不一致（服务端引入客户端模块）、第三方包导入路径不匹配、损坏的 `.next` 构建缓存
- 处理步骤：
  - 将所有客户端 Provider（如 `I18nProvider`、`UserProfileProvider`）放在 `app/providers.tsx` 并加 `use client`
  - 在服务端布局 `app/layout.tsx` 仅引入 `Providers` 组合组件，避免直接引入客户端模块
  - `@vercel/analytics` 使用 `@vercel/analytics/react` 于客户端；如遇异常，临时移除 `<Analytics />` 隔离问题
  - 安装缺失依赖：`critters`（Next CSS 优化）
  - 清理缓存：`rm -rf .next` 后重启 Dev Server
  - 设置 `metadataBase`：在 `metadata` 顶层加入 `new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3003')`
- 版本建议：保持 `next@15.x` 与 `react@19.x` 同步，遇到 RSC 异常频繁时可选择 `react@18.x` 或等待 Next 最新补丁；升级后务必运行 E2E 烟雾测试。

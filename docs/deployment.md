# 🚢 部署与环境配置

> 基于 Next.js App Router 与 Node.js 运行环境，支持多环境部署。

## 构建与启动
- 构建：`pnpm build`
- 启动：`pnpm start`（生产模式）
- 开发：`pnpm dev`（开发模式）

## 环境区分
- 开发：`NODE_ENV=development`，允许运行 `alerts-test` 轻量校验
- 生产/CI：`NODE_ENV=production`，`alerts-test` 自动跳过，避免误报
- 端口：默认 `3005`，可通过 `PORT` 覆盖

## 依赖与警告
- WebServer 依赖：CI 使用 `next start`，本地使用 `next dev`
- 构建警告：若出现 `require-in-the-middle` 的关键依赖警告，请确认相关依赖是否用于仅客户端环境；如为服务端转译警告可先忽略，但建议在升级依赖后再次验证

## 环境变量管理
- 参考 `docs/environment.md`，在平台侧（如 Vercel/自建服务器）配置密钥
- 日志与告警：确保至少配置一个 Slack Webhook；如需异常聚合使用 Sentry DSN

## 灰度与回滚建议
- 灰度策略：先在 Staging 启用 `category: 'auto'`，观察指标与告警，再按路由逐步推广
- 回滚方案：发现告警过多或阈值过严时，将路由临时切换到 `normal` 并提高 `performanceThresholdMs`，同时恢复默认限流参数

## 重要建议
- 生产环境部署后，建议在 24h 内查看 `RouteHealth` 采样结果与告警分布，并使用 `GET /api/health/advice` 获取优化建议列表作为调优指导 🌹

# 🔐 安全规范与最佳实践

> 通过输入校验、限流、告警与环境管理四层防护，降低常见风险。

## 输入与输出安全

- 使用 Zod 进行参数校验（`lib/api-health.ts` 内示例与 `POST /api/example` 路由）：
  - 校验邮箱、密码长度、数值范围等
  - 对外响应仅返回必要字段，避免敏感信息外泄
- 输出编码：避免将未转义的用户输入直接渲染到 HTML（前端组件已默认安全）

## 速率限制与事件健康

- 路由统一通过 `ApiHealth.monitorRoute` （`normal|heavy|auto`）：
  - 速率限制：默认 `normal=60/60s`，`heavy=20/30s`
  - 性能阈值：默认 `normal=1000ms`，`heavy=500ms`
  - 自动分类：基于 `p95` 与错误占比动态切换
- 事件循环与内存：建议在服务层监控进程资源（`rss/heapUsed` 与 event loop lag）

## 告警与审计

- Slack Webhook：按类型/类别分组通道，便于审计与回溯
- Sentry（可选）：捕获异常与性能警告，附加 tags/context 与面包屑
- Playwright 轻量校验：`alerts-test.spec.ts` 在非生产环境检验性能/错误链路

## 环境变量管理

- 使用 `lib/env.ts` 统一解析与 Zod 校验
- 必需变量：`NODE_ENV`、Webhook（至少一个）、可选 `SENTRY_DSN`
- 不在仓库提交 `.env` 文件；CI/CD 使用密钥管理（如 GitHub Actions secrets）

## 常见风险与应对

- SSRF：禁止直接调用用户提供的远端URL；执行时白名单与前缀校验
- XSS：避免将未过滤的用户内容渲染到前端；服务端响应仅返回 JSON
- CSRF：使用同源策略与安全方法（App Router API 默认安全，但前端表单仍需注意）
- 信息泄露：错误响应不包含堆栈与内部细节；仅记录到 Sentry/内部日志

## 重要建议

- 在 Staging 环境启用分组 Slack 与 Sentry，并按路由设置 `category: 'auto'`，让早期采样帮助自动调整阈值与限流，提升稳定性与可观测性 🌹

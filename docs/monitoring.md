# 🩺 API 健康监控与告警分发

## 包装器 `ApiHealth.monitorRoute`
- 参数：
  - `category`: `'normal' | 'heavy' | 'auto'`
  - `performanceThresholdMs`: 默认 `normal=1000ms`、`heavy=500ms`
  - `rateLimitMax`: 默认 `normal=60`、`heavy=20`
  - `windowMs`: 默认 `normal=60_000`、`heavy=30_000`
- 行为：
  - 速率限制（内存桶，按 IP+方法+路径键）
  - 性能阈值检测与 `performance` 告警
  - 异常捕获与 `error` 告警（返回 `500`）
  - 指标采样至 `RouteHealth`

## 自动分类 `RouteHealth`
- 采样记录：`recordApi(path, responseTimeMs, status)`
- 分类规则：
  - `heavy`：`p95 > 700ms` 或 `错误占比 > 5%`
  - `normal`：其他情况或采样不足（< 10）
- 建议输出：`generateRecommendations()` 返回高延迟/高错误占比路由的优化建议

## 告警分发 `lib/alerts.ts`
- Slack Webhook：按类型与类别选择通道
  - 默认：`SLACK_WEBHOOK_URL`
  - 性能（按类别）：`SLACK_WEBHOOK_URL_NORMAL`、`SLACK_WEBHOOK_URL_HEAVY`
  - 错误：`SLACK_WEBHOOK_URL_ERRORS`
- Sentry：存在 `SENTRY_DSN` 时，上报 `error/warning/info`，附加面包屑与 tags/context

## 路由示例
- `GET /api/health`：`{ category: 'auto' }`
- `GET /api/example`：`{ category: 'auto' }`
- `POST /api/example`：`{ category: 'heavy', performanceThresholdMs: 500, rateLimitMax: 20, windowMs: 30_000 }`
- `GET /api/alerts-test`：人为延时 600ms 触发 heavy 性能告警；`type=error` 触发错误告警
- `GET /api/health/advice`：返回 `RouteHealth.generateRecommendations()` 的建议列表

## 重要建议
- 在非生产环境配置分组 Webhook 并运行 `alerts-test` 轻量校验，可快速确认性能与错误告警链路的正确性 🌹

# 🌐 API 路由说明

> 当前已接入 `ApiHealth.monitorRoute` 的路由列表与分类策略。

## 路由列表

- `GET /api/health`
  - 类别：`auto`（采样不足时默认 normal）
  - 行为：返回内存/CPU 等基础指标样本
- `GET /api/health/advice`
  - 类别：`normal`
  - 行为：返回 `RouteHealth.generateRecommendations()` 的优化建议列表
- `GET /api/example`
  - 类别：`auto`
  - 行为：返回示例信息
- `POST /api/example`
  - 类别：`heavy`（严格限流：`rateLimitMax=20, windowMs=30_000`）
  - 行为：校验并回显请求体（Zod）
- `GET /api/alerts-test`
  - 类别：`heavy`（`performanceThresholdMs=500`）
  - 行为：通过 `type=perf|error` 验证性能/错误告警链路

## 分类与限流策略

- `normal`：`threshold=1000ms`，`rateLimitMax=60`，`windowMs=60_000`
- `heavy`：`threshold=500ms`，`rateLimitMax=20`，`windowMs=30_000`
- `auto`：基于 `RouteHealth.getCategory(path)` 动态判定
  - 规则：`p95 > 700ms` 或 `错误占比 > 5%` → `heavy`；否则 `normal`

## 重要建议

- 新增路由时建议采用 `category: 'auto'` 并按需要覆盖 `performanceThresholdMs`、`rateLimitMax`、`windowMs`，以在早期达到更平衡的限流与告警敏感度 🌹

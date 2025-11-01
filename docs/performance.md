# ⚡ 性能优化指南

> 数据库索引与缓存优先，结合自动分类实现动态阈值与限流。

## 数据库优化（PostgreSQL）

- 索引示例：
  - `CREATE INDEX CONCURRENTLY idx_users_email ON users(email);`
  - `CREATE INDEX CONCURRENTLY idx_orders_user_id_created_at ON orders(user_id, created_at DESC);`
- 查询优化：
  - 避免 `SELECT *`，明确字段
  - 使用 `EXPLAIN ANALYZE` 观察慢查询并建立覆盖索引

## 缓存策略（Redis）

- 通用缓存：`CacheService.getWithCache(key, fetcher)` 默认 TTL `3600s`
- 建议：
  - 热路径（首页、频繁查询）提高命中率
  - 非一致性要求场景可使用轻度延迟写入

## 路由分类与阈值

- `normal`：阈值 `1000ms`，限流 `60/60s`
- `heavy`：阈值 `500ms`，限流 `20/30s`
- `auto`：采样驱动（`p95`、错误占比）动态切换类别

## 指标与建议

- 使用 `RouteHealth.generateRecommendations()` 获取优化项：高延迟路由与高错误占比路径优先
- 常用手段：
  - 数据库索引与查询重写
  - 引入 Redis 层缓存与批量接口（避免 N+1）
  - 增加异步处理（队列/批处理）

## 重要建议

- 为新路由启用 `category: 'auto'` 并在前两周保持观察，通过建议列表快速定位瓶颈与异常路径，避免过早固化限制策略 🌹

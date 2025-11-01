# 🧾 变更日志

遵循 Keep a Changelog 与语义化版本（SemVer）。

## [0.1.0] - 2025-10-31
- 路由自动分类：`category: 'auto'` 基于 p95 与错误占比动态切换
- 健康监控：`RouteHealth` 记录指标、输出建议；新增 `GET /api/health/advice`
- 告警分发：Slack 分组渠道与 Sentry 聚合上报集成
- E2E 测试：新增 `alerts-test.spec.ts`（条件跳过）与关键路径用例
- 文档体系：新增架构、监控、环境、路由、测试、安全、贡献、部署、故障排查、性能等
- 类型中心化：新增 `types/health.ts` 并迁移 `lib/health-monitor.ts` 类型引用
- 环境配置：新增 `config/development.ts`、`config/production.ts` 与动态加载器 `config/index.ts`

## [0.0.9] - 2024-10-30
- 初始项目结构与基础路由/组件搭建

---

变更分类建议：
- `feat`: 新功能
- `fix`: 问题修复
- `docs`: 文档变更
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 依赖/工具链

# 📘 项目文档总览

> 本目录提供标准化的项目文档，涵盖架构、监控与告警、环境变量、测试与路由说明，帮助快速理解与维护本仓库。

## 目录结构
- `architecture.md`：系统架构与核心模块说明
- `monitoring.md`：API 健康监控、自动分类与告警分发
- `environment.md`：环境变量配置与样例
- `testing.md`：E2E/单元测试与 Playwright 配置
- `api-routes.md`：当前 API 路由列表与分类

## 快速开始
- 安装依赖：`pnpm install`
- 本地开发：`pnpm dev`
- 类型检查：`pnpm typecheck`
- 端到端测试：`pnpm e2e`

## 关键建议
- 建议在非生产环境配置分组 Slack Webhook（`SLACK_WEBHOOK_URL_NORMAL`、`SLACK_WEBHOOK_URL_HEAVY`、`SLACK_WEBHOOK_URL_ERRORS`），并启用 Sentry DSN，以获得更清晰的按类别告警与聚合分析能力 🌹

## 索引
- `core-features.md` 核心功能清单
- `CHANGELOG.md` 变更日志
- `architecture.md` 架构与核心模块
- `monitoring.md` API 监控与告警
- `environment.md` 环境变量配置
- `api-routes.md` 路由与分类策略
- `testing.md` 测试与 CI
- `SECURITY.md` 安全规范
- `CONTRIBUTING.md` 贡献指南
- `deployment.md` 部署与环境区分
- `troubleshooting.md` 故障排查
- `performance.md` 性能优化
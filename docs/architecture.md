# 🏗️ 架构与核心模块说明

## 技术栈

- 前端：Next.js 14（App Router）、React 18、TypeScript、Tailwind CSS
- 后端：Node.js（App Router API）、TypeScript
- 测试：Playwright（E2E）、Jest（单元）
- 监控：内置告警分发（Slack Webhook/Sentry 可选）

## 项目结构（摘要）

- `app/api/*`：App Router API 路由
- `components/*`：UI 组件（包含对话、编辑器、主题/语言切换等）
- `lib/*`：通用库（`api-health`、`alerts`、`health-monitor`、`env`、`i18n`等）
- `e2e/*`：Playwright 端到端测试

## 核心模块

- `lib/api-health.ts`
  - `ApiHealth.monitorRoute(handler, options)`：API 路由包装器（速率限制、性能阈值、错误捕获、告警分发、指标采样）
  - 支持 `category: 'normal' | 'heavy' | 'auto'`，自动分类依赖 `RouteHealth`
- `lib/health-monitor.ts`
  - `RouteHealth.recordApi(path, rtMs, status)`：记录路由响应时间与错误占比
  - `RouteHealth.getCategory(path)`：根据 p95 与错误占比进行自动分类
  - `RouteHealth.generateRecommendations()`：生成优化建议列表
- `lib/alerts.ts`
  - 按告警类型与路由类别选择 Slack Webhook；同时上报 Sentry（可选）
- `lib/env.ts`
  - 使用 Zod 校验环境变量，并统一导出 `env`
- `playwright.config.ts`
  - 本地使用 `next dev`，CI 使用 `next start`；基于 `PORT` 配置 baseURL

## 数据与监控流

- 路由处理 → `ApiHealth.monitorRoute` 包装 → 速率限制与性能阈值判断 → 告警分发（Slack/Sentry）→ 指标采样入 `RouteHealth` → 自动分类与建议输出

## 重要建议

- 新增 API 路由时统一使用 `ApiHealth.monitorRoute` 包装，并考虑设置为 `category: 'auto'`，随采样动态调整限流与阈值 🌹

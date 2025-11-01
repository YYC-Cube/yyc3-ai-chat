<div align="center" style="max-width:980px;margin:0 auto;">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/Github-Nexus.png" />
  <source media="(prefers-color-scheme: light)" srcset="public/Git-Expansion.png" />
  <img src="public/Github-Nexus.png" alt="YanYu Cloud³ — Nexus Expansion" style="width:100%;border-radius:12px;" />
</picture>

<br/>

<a href="https://nodejs.org/en/" target="_blank"><img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen" alt="Node >= 18" /></a>
<a href="https://nextjs.org/" target="_blank"><img src="https://img.shields.io/badge/Next.js-15.2-black" alt="Next.js 15.2" /></a>
<a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/TypeScript-5.9-blue" alt="TypeScript 5.9" /></a>
<a href="https://react.dev/" target="_blank"><img src="https://img.shields.io/badge/React-19-61DAFB" alt="React 19" /></a>
<a href="https://pnpm.io/" target="_blank"><img src="https://img.shields.io/badge/pnpm-8-ffdd00" alt="pnpm 8" /></a>
<a href="https://playwright.dev/" target="_blank"><img src="https://img.shields.io/badge/Playwright-E2E-2ea44f" alt="Playwright E2E" /></a>
<a href=".github/workflows/ci.yml" target="_blank"><img src="https://img.shields.io/badge/CI-GitHub%20Actions-blue" alt="CI GitHub Actions" /></a>

</div>

# AI-Chat / YYC3 AI Programming

一个基于 Next.js 14 App Router 的 AI 对话与健康监控示例项目，内置 API 健康包装器、自动分类（p95/错误占比）、Slack/Sentry 告警分发、E2E 测试与完善的文档体系。

## 顶图与素材

- 主要 Logo：`public/yyc3-brand-logo.png`（顶图）
- 其他素材：`public/Github-Nexus.png`、`public/Git-Nexus.png`、`public/Git-Expansion.png`
- 在文档或 README 中可通过相对路径引用：`public/文件名.png`

## 快速开始

- 安装依赖：`pnpm i`
- 本地开发：`pnpm dev`（默认端口 `3005` 或 Playwright 使用的端口）
- 构建与启动：`pnpm build && pnpm start`
- 类型检查：`pnpm typecheck`
- E2E 测试：`pnpm e2e`

## 技术栈

- 前端：Next.js 14（App Router）、React 18/19、TypeScript、Tailwind CSS
- 后端：App Router API（Node.js）
- 测试：Playwright（E2E）、Jest（单元）
- 监控：Slack Webhook / Sentry（可选）

## 核心功能

- API 健康包装器：`ApiHealth.monitorRoute(handler, options)`
  - 速率限制、性能阈值、错误捕获、指标采样、外部告警分发
  - 类别：`normal | heavy | auto`；`auto` 基于 `p95 > 700ms` 或错误占比 `> 5%` 动态分类
- 采样与建议：`RouteHealth.recordApi`、`RouteHealth.generateRecommendations`
  - 输出性能/稳定性优化建议（含预期收益与投入估算）
- 告警分发：`lib/alerts.ts`
  - Slack 分组（normal/heavy/errors）与 Sentry 聚合（可选）
- 环境与配置：`lib/env.ts`（Zod 校验）、`.env.example` 模板、`config/index.ts` 动态加载器

## 主要路由

- `GET /api/health`：系统健康采样（auto）
- `GET /api/health/advice`：健康建议列表（normal）
- `GET /api/example`：示例接口（auto）
- `POST /api/example`：示例提交（heavy，严格限流）
- `GET /api/alerts-test`：性能/错误告警链路校验（非生产执行）

## 文档索引

- `docs/core-features.md` 核心功能清单
- `docs/architecture.md` 架构与核心模块
- `docs/monitoring.md` API 监控与告警
- `docs/environment.md` 环境变量配置
- `docs/api-routes.md` 路由与分类策略
- `docs/testing.md` 测试与 CI
- `docs/SECURITY.md` 安全规范
- `docs/CONTRIBUTING.md` 贡献指南
- `docs/deployment.md` 部署与环境区分
- `docs/troubleshooting.md` 故障排查
- `docs/performance.md` 性能优化
- `docs/CHANGELOG.md` 变更日志

## 环境与运行

- 环境变量：参考 `.env.example` 并在平台侧配置密钥（CI/CD 使用 secrets）
- 环境配置：通过 `config/index.ts` 根据 `env.NODE_ENV` 自动选择 development/production
- Playwright 配置：本地 `next dev`、CI `next start`；E2E `baseURL` 基于 `PORT`

## 贡献与规范

- 提交模板：`.github/commit_template.md`（Conventional Commits）
- 建议在 PR 前运行 `pnpm typecheck` 与 `pnpm e2e`，确保类型与关键路径稳定

## 联系方式

- Email: `admin@0379.email`

## 重要建议

- 建议新路由使用 `category: 'auto'` 并在 Staging 环境启用分组 Slack 与 Sentry，观察采样与告警分布后再微调阈值与限流，实现更平衡的稳定性与性能 🌹

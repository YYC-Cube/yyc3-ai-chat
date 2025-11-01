# 🧠 核心功能清单

> 项目关键能力一览，便于快速理解与扩展。

## 运行与架构

- Next.js 14 App Router（React 18 + TypeScript）
- UI 组件库与主题切换（`components/ui/*` + `next-themes`）
- 国际化能力（`lib/i18n.tsx`，`locales/*`）

## 健康监控与告警

- API 包装器：`ApiHealth.monitorRoute(handler, options)`
  - 速率限制、性能阈值、错误捕获、指标采样、外部告警
  - 类别：`normal | heavy | auto`（auto 基于 p95 与错误占比）
- 采样与建议：`RouteHealth.recordApi`、`RouteHealth.generateRecommendations`
  - 自动分类：`p95 > 700ms` 或 `错误占比 > 5%` → `heavy`
  - 建议输出：性能与稳定性优化项（含预期收益与投入估算）
- 告警分发：`lib/alerts.ts`
  - Slack 分组 Webhook：按类型与类别分发
  - Sentry 聚合（可选）：捕获错误与性能告警，包含 tags/context

## 环境与配置

- 环境变量：`lib/env.ts`（Zod 校验）与 `.env.example`
- 环境配置：`config/development.ts`、`config/production.ts`、`config/index.ts`
- Next 配置：`next.config.mjs`（`images.domains`、`compiler.removeConsole`、`experimental.optimizeCss`）

## API 路由

- `GET /api/health`：系统健康采样（auto）
- `GET /api/health/advice`：健康建议列表（normal）
- `GET /api/example`：示例接口（auto）
- `POST /api/example`：示例提交（heavy，严格限流）
- `GET /api/alerts-test`：性能/错误告警链路校验（非生产执行）

## 测试与质量

- E2E：Playwright（本地 `next dev`，CI `next start`）
- 单元：Jest（i18n 基础能力）
- 类型检查：`pnpm typecheck`
- 提交规范：Conventional Commits 与 `.github/commit_template.md`

## 文档体系

- 项目概览：`docs/README.md`
- 架构：`docs/architecture.md`
- 监控：`docs/monitoring.md`
- 环境：`docs/environment.md`
- 路由：`docs/api-routes.md`
- 测试：`docs/testing.md`
- 安全：`docs/SECURITY.md`
- 贡献：`docs/CONTRIBUTING.md`
- 部署：`docs/deployment.md`
- 故障排查：`docs/troubleshooting.md`
- 性能优化：`docs/performance.md`
- 变更日志：`docs/CHANGELOG.md`

## 重要建议

- 新增路由建议使用 `category: 'auto'` 并观察采样数据与告警分布；必要时按路径微调阈值与限流，稳步提升性能与稳定性 🌹

## 品牌与设计资源

为统一品牌呈现与多平台兼容，这里收录 `public/` 目录的素材与使用建议：

- 核心横幅
  - `public/Github-Nexus.png`：深色风格横幅，适用于暗色主题或 GitHub 深色模式
  - `public/Git-Expansion.png`：浅色风格横幅，适用于亮色主题或文档首页
  - `public/Git-Nexus.png`：备选横幅版本，可在博客或发布页使用
- 品牌徽标
  - `public/yyc3-logo-white.png`：白色徽标，建议用于暗色背景
  - `public/yyc3-logo-blue.png`：蓝色徽标，建议用于浅色背景
  - `public/yyc3-logo.svg`：矢量徽标，适合高分辨率或可缩放场景
  - `public/yyc3-brand-logo.png`：品牌主图，用于产品页或宣传图
- 占位资源
  - `public/placeholder*.{png,jpg,svg}`：组件示例或文档插图占位

### 使用建议

- README 顶图：通过 `<picture>` 实现主题适配（暗色用 `Github-Nexus.png`，亮色用 `Git-Expansion.png`），容器设置 `max-width: 980px`、图片 `width: 100%`。
- 徽章分组：顶图下方放置技术栈与 CI 徽章，保持居中与可点击链接。
- Next.js 页面：在 `app/page.tsx` 顶部可使用 `next/image` 引入对应主题图，并结合 `prefers-color-scheme` 进行切换。
- 可访问性：所有图片添加 `alt` 文本；图中文字信息需在文案中重复以满足可访问性。
- 性能与优化：
  - 优先使用 SVG 徽标；位图资源建议压缩到合理尺寸（横幅宽度 1600px 内）。
  - 静态资源命名清晰，避免空格与大写；引用路径统一使用相对路径。
- 发布渠道：GitHub、项目官网、文档站保持一致的视觉风格；需要社交媒体尺寸时可导出 1200×630（Open Graph）。

### 维护与治理

- 每次更新素材需在 `docs/CHANGELOG.md` 标注（`docs: update branding assets`）。
- 在 PR 中附带预览截图或链接，保证评审质量。
- 若涉及授权或第三方素材，补充版权来源与许可说明。

> 建议将品牌规范纳入项目 Onboarding 文档，确保团队统一使用规范化资源。🌹

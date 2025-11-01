# 🤝 贡献指南

> 面向协作开发的标准流程与要求，确保质量一致性。

## 环境准备

- Node.js ≥ 18、pnpm ≥ 8
- 安装依赖：`pnpm i`
- 本地开发：`pnpm dev`（默认端口 `3005`）

## 提交流程

- 分支命名：`feat/<short-name>`、`fix/<short-name>`、`docs/<short-name>`
- 提交信息：使用约定式提交（Conventional Commits）
  - `feat:` 新功能、`fix:` 修复、`docs:` 文档、`refactor:` 重构、`test:` 测试、`chore:` 依赖
- PR 检查清单：
  - 已运行 `pnpm typecheck` 与关键路径 `pnpm e2e`
  - 新增路由使用 `ApiHealth.monitorRoute` 包装（建议 `category: 'auto'`）
  - 已更新或新增相关文档（如 `api-routes.md`、`monitoring.md`）

## 代码规范

- TypeScript 严格模式，避免 `any`
- ESLint + Prettier（保持默认配置）
- 注释规范：使用 JSDoc 与中文说明（参考 `user_rules.md` 示例）

## 测试规范

- 单元测试：重点覆盖工具库与边界行为
- E2E 测试：覆盖首页渲染、主题切换、健康路由与基础交互
- 告警校验：在非生产环境启用 `alerts-test` 轻量测试

## 风险提示

- 在生产环境运行 E2E 时会使用 `next start`；若存在对开发模式依赖（如热重载），请确保用例不依赖 dev-only 功能
- 变更路由限流与自动分类会影响告警频率与阈值，建议在 Staging 环境观察至少 24h 后再推广到生产 🌹

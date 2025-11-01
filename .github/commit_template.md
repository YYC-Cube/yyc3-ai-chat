# 提交信息模板（Conventional Commits）

<type>(<scope>): <subject>

<body>
- 变更动机与实现概要
- 风险与影响范围（如限流/告警阈值变更）
- 测试与验证（typecheck/e2e）

<footer>
- 关联 Issue/PR: #123
- BREAKING CHANGE: 说明不兼容变更

示例：

feat(api-health): 引入自动分类并调整 heavy 默认阈值

- 新增 category 'auto'，p95>700ms 或错误占比>5% 归为 heavy
- 更新 POST /api/example 的限流窗口为 30s
- e2e 通过（5 通过，2 跳过）

BREAKING CHANGE: API 性能告警触发阈值调整，可能增加 early alerts

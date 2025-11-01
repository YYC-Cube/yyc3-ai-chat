# ⚙️ 环境变量

> 使用 `lib/env.ts` 进行 Zod 校验与统一导出，未配置的可选变量安全回退。

## 变量列表
- `NODE_ENV`: `development | production | test`（默认 `development`）
- `CUSTOM_KEY`: 可选，项目特定示例键
- `SLACK_WEBHOOK_URL`: 默认 Webhook（若无分组则使用）
- `SLACK_WEBHOOK_URL_NORMAL`: 正常类别性能告警分组
- `SLACK_WEBHOOK_URL_HEAVY`: 重载类别性能告警分组
- `SLACK_WEBHOOK_URL_ERRORS`: 错误类型告警分组
- `SENTRY_DSN`: Sentry 项目 DSN（可选）

## 配置示例（Staging/开发）
```env
# 基本环境
NODE_ENV=development

# Slack 分组（至少配置一个以便验证分组分发）
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/yyy/zzz
SLACK_WEBHOOK_URL_NORMAL=https://hooks.slack.com/services/xxx/yyy/nnn
SLACK_WEBHOOK_URL_HEAVY=https://hooks.slack.com/services/xxx/yyy/hhh
SLACK_WEBHOOK_URL_ERRORS=https://hooks.slack.com/services/xxx/yyy/eee

# Sentry（可选）
SENTRY_DSN=https://<key>@sentry.io/<project>
```

## 重要建议
- 建议在非生产环境（例如 Staging）启用分组 Slack Webhook 与 Sentry DSN，以便区分性能与错误告警并进行聚合分析 🌹

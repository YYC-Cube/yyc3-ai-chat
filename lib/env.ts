/**
 * @file 环境变量验证模块
 * @description 使用 Zod 校验必需环境变量，统一加载入口
 * @module env
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-31
 * @updated 2024-10-31
 */
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CUSTOM_KEY: z.string().optional(),
  // Slack 分组频道（可选）：默认使用 SLACK_WEBHOOK_URL，若设置以下变量则按类别分发
  SLACK_WEBHOOK_URL: z.string().url().optional(),
  SLACK_WEBHOOK_URL_NORMAL: z.string().url().optional(),
  SLACK_WEBHOOK_URL_HEAVY: z.string().url().optional(),
  SLACK_WEBHOOK_URL_ERRORS: z.string().url().optional(),
  // Sentry DSN（可选）
  SENTRY_DSN: z.string().url().optional(),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  CUSTOM_KEY: process.env.CUSTOM_KEY,
  SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL,
  SLACK_WEBHOOK_URL_NORMAL: process.env.SLACK_WEBHOOK_URL_NORMAL,
  SLACK_WEBHOOK_URL_HEAVY: process.env.SLACK_WEBHOOK_URL_HEAVY,
  SLACK_WEBHOOK_URL_ERRORS: process.env.SLACK_WEBHOOK_URL_ERRORS,
  SENTRY_DSN: process.env.SENTRY_DSN,
});

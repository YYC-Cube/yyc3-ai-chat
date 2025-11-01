/**
 * @file 告警分发器
 * @description 将 ApiHealth 的告警上报到外部系统（Slack Webhook、Sentry 可选）
 * @module alerts
 * @author YYC
 * @version 1.1.0
 * @created 2024-10-31
 * @updated 2024-10-31
 */
import * as Sentry from '@sentry/node';

import type { Alert } from './api-health';
import { ApiHealth } from './api-health';
import { env } from './env';


/**
 * 初始化 Sentry（仅当存在 SENTRY_DSN 时）
 */
let sentryInited = false;
function initSentry() {
  if (env.SENTRY_DSN && !sentryInited) {
    Sentry.init({ dsn: env.SENTRY_DSN, environment: env.NODE_ENV });
    sentryInited = true;
  }
}

/**
 * 发送到 Slack Webhook（只在 SLACK_WEBHOOK_URL 存在时启用）
 */
async function sendSlack(alert: Alert) {
  // 选择分发频道：按类型与类别选择专属 Webhook，若未配置则退回默认
  const category = String(alert.detail?.category || '');
  let webhook = env.SLACK_WEBHOOK_URL || '';
  if (alert.type === 'error' && env.SLACK_WEBHOOK_URL_ERRORS) {
    webhook = env.SLACK_WEBHOOK_URL_ERRORS;
  } else if (alert.type === 'performance') {
    if (category === 'heavy' && env.SLACK_WEBHOOK_URL_HEAVY) webhook = env.SLACK_WEBHOOK_URL_HEAVY;
    else if (category === 'normal' && env.SLACK_WEBHOOK_URL_NORMAL)
      webhook = env.SLACK_WEBHOOK_URL_NORMAL;
  }
  if (!webhook) return;

  try {
    const detail = alert.detail || {};
    const lines = [
      `🚨 API 告警 (${alert.type}) - ${category || 'n/a'}`,
      alert.message,
      `• Path: ${detail.path} • Method: ${detail.method} • Status: ${detail.status}`,
      typeof detail.responseTime === 'number'
        ? `• RT: ${Math.round(detail.responseTime)}ms`
        : undefined,
    ].filter(Boolean);

    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: lines.join('\n') }),
    });
  } catch (err) {
     
    console.error('Slack 告警发送失败', err);
  }
}

/**
 * 发送到 Sentry（只在 SENTRY_DSN 存在时启用，偏向聚合）
 */
async function sendSentry(alert: Alert) {
  if (!env.SENTRY_DSN) return;
  initSentry();
  try {
    const tags = {
      type: alert.type,
      path: alert.detail?.path,
      method: alert.detail?.method,
      status: String(alert.detail?.status ?? ''),
    };
    const extra = alert.detail ?? {};
    if (alert.type === 'error') {
      Sentry.captureMessage(alert.message, 'error');
      Sentry.addBreadcrumb({
        category: 'api',
        message: alert.message,
        data: extra,
        level: 'error',
      });
    } else if (alert.type === 'performance') {
      Sentry.captureMessage(alert.message, 'warning');
      Sentry.addBreadcrumb({
        category: 'api',
        message: alert.message,
        data: extra,
        level: 'warning',
      });
    } else {
      Sentry.captureMessage(alert.message, 'info');
      Sentry.addBreadcrumb({ category: 'api', message: alert.message, data: extra, level: 'info' });
    }
    Sentry.setTags(tags);
    Sentry.setContext('api-detail', extra);
  } catch (err) {
     
    console.error('Sentry 告警发送失败', err);
  }
}

/**
 * 在模块加载时进行一次性绑定（幂等）
 */
let bound = false;
export function setupApiAlerts() {
  if (bound) return;
  bound = true;
  ApiHealth.onAlert = (alert) => {
    // 控制台输出已由 ApiHealth.sendAlert 执行，这里做双路上报
    void sendSlack(alert); // 即时通知
    void sendSentry(alert); // 聚合分析
  };
}

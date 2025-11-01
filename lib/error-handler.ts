/**
 * @file 统一错误处理模块
 * @description 标准化错误日志与外部告警，便于监控与审计
 * @module lib/error-handler
 * @author YYC
 * @version 1.0.0
 * @created 2025-10-31
 * @updated 2025-10-31
 */

import { ApiHealth } from './api-health';

export class ErrorHandler {
  /**
   * 处理错误并发送告警
   * @param error - 未知错误对象
   * @param context - 上下文标识（路由/模块名）
   */
  static handle(error: unknown, context: string) {
    // 控制台日志（不包含敏感信息）
     
    console.error(`🚨 [${context}] 错误:`, error);
    // 外部告警（通过 ApiHealth 分发到 Slack/Sentry）
    ApiHealth.sendAlert({
      type: 'error',
      message: `模块错误: ${context}`,
      detail: { path: context, method: 'n/a', status: 500 },
      at: Date.now(),
    });
  }

  /**
   * 发送外部告警（可独立调用）
   */
  static sendAlert(message: string, context: string) {
    ApiHealth.sendAlert({
      type: 'error',
      message: `${message}`,
      detail: { path: context, method: 'n/a', status: 500 },
      at: Date.now(),
    });
  }
}

/**
 * @file API 健康监控与包装器
 * @description 提供速率限制、负载监控、错误告警与指标记录；用于 App Router 路由包装
 * @module api-health
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-31
 * @updated 2024-10-31
 */
import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';

import { RouteHealth } from './health-monitor';

/** 指标结构 */
export interface ApiHealthMetrics {
  responseTime: number;
  status: number;
  error?: string;
  payloadSize?: number;
  method: string;
  path: string;
  timestamp: number;
}

/** 简单告警结构 */
export interface Alert {
  type: 'rate-limit' | 'error' | 'performance';
  message: string;
  detail?: Record<string, any>;
  at: number;
}

/** 内存速率限制器（开发环境适用） */
class RateLimiter {
  private static buckets = new Map<string, { count: number; resetAt: number }>();
  static WINDOW_MS = 60_000;
  static MAX_COUNT = 60;

  static check(
    key: string,
    max = RateLimiter.MAX_COUNT,
    windowMs = RateLimiter.WINDOW_MS
  ): boolean {
    const now = Date.now();
    const entry = this.buckets.get(key);
    if (!entry || now > entry.resetAt) {
      this.buckets.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }
    if (entry.count >= max) return false;
    entry.count += 1;
    return true;
  }
}

/**
 * @description API 健康包装器
 * 用法：
 * export const GET = ApiHealth.monitorRoute(async (req) => { ... return NextResponse.json(data) })
 */
export class ApiHealth {
  static alerts: Alert[] = [];
  static onAlert?: (alert: Alert) => void;

  /** 发送告警 */
  static sendAlert(alert: Alert) {
    this.alerts.push(alert);
    // 默认输出到控制台；可接入外部监控
     
    console.error(`🚨 [API] ${alert.type}: ${alert.message}`, alert.detail);
    this.onAlert?.(alert);
  }

  /**
   * 包装 App Router 路由处理器：带速率限制、响应时间度量与错误处理
   */
  static monitorRoute<T extends (req: NextRequest) => Promise<NextResponse> | NextResponse>(
    handler: T,
    options?: {
      category?: 'normal' | 'heavy' | 'auto';
      performanceThresholdMs?: number; // 默认 normal: 1000ms, heavy: 500ms
      rateLimitMax?: number; // 默认 normal: 60, heavy: 20
      windowMs?: number; // 默认 normal: 60_000, heavy: 30_000
    }
  ) {
    const baseCategory = options?.category ?? 'normal';
    return async (req: NextRequest): Promise<NextResponse> => {
      const start = performance.now();
      const ip = req.headers.get('x-forwarded-for') || 'local';
      const path = new URL(req.url).pathname;
      const key = `${ip}:${req.method}:${path}`;

      // 动态类别（auto）与按类别默认阈值/速率限制
      const category = baseCategory === 'auto' ? RouteHealth.getCategory(path) : baseCategory;
      const performanceThresholdMs =
        options?.performanceThresholdMs ?? (category === 'heavy' ? 500 : 1000);
      const rateLimitMax = options?.rateLimitMax ?? (category === 'heavy' ? 20 : 60);
      const windowMs = options?.windowMs ?? (category === 'heavy' ? 30_000 : 60_000);

      // 速率限制（按路由类别可调整）
      if (!RateLimiter.check(key, rateLimitMax, windowMs)) {
        const metrics: ApiHealthMetrics = {
          responseTime: performance.now() - start,
          status: 429,
          method: req.method,
          path,
          timestamp: Date.now(),
          error: 'Rate limit exceeded',
        };
        this.sendAlert({
          type: 'rate-limit',
          message: '速率限制触发',
          detail: { ...metrics, category },
          at: Date.now(),
        });
        RouteHealth.recordApi(path, metrics.responseTime, 429);
        return NextResponse.json({ ok: false, error: 'Too Many Requests' }, { status: 429 });
      }

      try {
        const res = await handler(req);
        const responseTime = performance.now() - start;
        const metrics: ApiHealthMetrics = {
          responseTime,
          status: res.status,
          method: req.method,
          path,
          timestamp: Date.now(),
        };
        if (responseTime > performanceThresholdMs) {
          this.sendAlert({
            type: 'performance',
            message: `API 响应时间过长（${category}）`,
            detail: { ...metrics, category },
            at: Date.now(),
          });
        }
        RouteHealth.recordApi(path, responseTime, res.status);
        return res;
      } catch (error: any) {
        const responseTime = performance.now() - start;
        const metrics: ApiHealthMetrics = {
          responseTime,
          status: 500,
          error: error?.message || String(error),
          method: req.method,
          path,
          timestamp: Date.now(),
        };
        this.sendAlert({
          type: 'error',
          message: 'API 处理异常',
          detail: { ...metrics, category },
          at: Date.now(),
        });
        RouteHealth.recordApi(path, responseTime, 500);
        return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
      }
    };
  }
}

import { setupApiAlerts } from './alerts';

// 模块加载时绑定外部告警（如 Slack）
setupApiAlerts();

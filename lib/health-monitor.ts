/**
 * @file 健康监控模块
 * @description 采集运行时/应用/数据库健康指标并提供评分与建议
 * @module health-monitor
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-31
 * @updated 2024-10-31
 */

import type { HealthMetrics, Recommendation } from '../types/health'

export class HealthMonitor {
  static sample(): HealthMetrics {
    const mem = process.memoryUsage();
    const cpu = process.cpuUsage();

    return {
      memoryUsage: {
        heapUsed: mem.heapUsed,
        heapTotal: mem.heapTotal,
        external: mem.external,
        rss: mem.rss,
      },
      cpuUsage: {
        user: cpu.user,
        system: cpu.system,
      },
      eventLoop: {
        lag: 0,
        utilization: 0,
      },
      apiHealth: {
        responseTime: 0,
        errorRate: 0,
        throughput: 0,
      },
      database: {
        connectionPool: 0,
        queryPerformance: 0,
        replicationLag: 0,
      },
    };
  }
}

// === 路由健康顾问（基于采样的自动分类与建议）===
export interface RouteStats {
  path: string;
  samples: number[]; // 最近响应时间采样（ms）
  total: number; // 总请求数
  errors: number; // 错误次数
  updatedAt: number; // 最近更新时间戳
}



const MAX_SAMPLES = 200;
const statsMap = new Map<string, RouteStats>();

function percentile(arr: number[], p: number): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx];
}

export const RouteHealth = {
  /**
   * 记录一次 API 请求指标
   */
  recordApi(path: string, responseTimeMs: number, status: number) {
    const now = Date.now();
    const existing = statsMap.get(path) || {
      path,
      samples: [],
      total: 0,
      errors: 0,
      updatedAt: now,
    };
    existing.total += 1;
    if (status >= 500) existing.errors += 1; // 5xx 记为错误
    existing.samples.push(responseTimeMs);
    if (existing.samples.length > MAX_SAMPLES) existing.samples.shift();
    existing.updatedAt = now;
    statsMap.set(path, existing);
  },

  /**
   * 基于 p95 响应时间与错误占比进行分类
   * - heavy: p95 > 700ms 或 错误占比 > 5%
   * - normal: 其他
   */
  getCategory(path: string): 'normal' | 'heavy' {
    const s = statsMap.get(path);
    if (!s || s.samples.length < 10) return 'normal'; // 数据不足时维持 normal
    const p95 = percentile(s.samples, 95);
    const errRate = s.total > 0 ? s.errors / s.total : 0;
    if (p95 > 700 || errRate > 0.05) return 'heavy';
    return 'normal';
  },

  /**
   * 生成建议列表：针对高延迟与高错误占比的路由
   */
  generateRecommendations(): Recommendation[] {
    const recs: Recommendation[] = [];
    for (const s of statsMap.values()) {
      if (s.samples.length < 10) continue; // 数据不足不建议
      const p95 = percentile(s.samples, 95);
      const errRate = s.total > 0 ? s.errors / s.total : 0;
      if (p95 > 700) {
        recs.push({
          type: 'performance',
          priority: p95 > 1200 ? 'high' : 'medium',
          title: '高延迟路由优化',
          description: `路由 ${s.path} p95=${Math.round(p95)}ms，建议优化查询或添加缓存`,
          action: '优化数据库索引，增加 Redis 缓存；审查 N+1 查询',
          expectedImprovement: '响应时间降低30%-50%',
          effort: p95 > 1200 ? 'high' : 'medium',
          path: s.path,
        })
      }
      if (errRate > 0.05) {
        recs.push({
          type: 'stability',
          priority: errRate > 0.15 ? 'high' : 'medium',
          title: '高错误率路由稳定性改善',
          description: `路由 ${s.path} 错误占比 ${(errRate * 100).toFixed(1)}%，建议加强错误边界与重试`,
          action: '完善输入校验与错误处理；引入幂等与重试策略',
          expectedImprovement: '错误率降低40%-60%',
          effort: errRate > 0.15 ? 'high' : 'medium',
          path: s.path,
        })
      }
    }
    // 按优先级排序
    return recs.sort((a, b) => {
      const pri = { high: 3, medium: 2, low: 1 } as const;
      return pri[b.priority] - pri[a.priority];
    });
  },
};
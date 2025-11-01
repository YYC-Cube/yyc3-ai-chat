/**
 * @file 健康指标类型定义
 * @description 定义运行时、应用与数据库健康指标，以及评分与建议类型
 * @module types/health
 * @author YYC
 * @version 1.0.0
 * @created 2025-10-31
 * @updated 2025-10-31
 */

export interface HealthMetrics {
  // 运行时健康指标
  memoryUsage: {
    heapUsed: number;
    heapTotal: number;
    external: number;
    rss: number;
  };
  cpuUsage: {
    user: number;
    system: number;
  };
  eventLoop: {
    lag: number;
    utilization: number;
  };

  // 应用健康指标
  apiHealth: {
    responseTime: number;
    errorRate: number;
    throughput: number;
  };

  // 数据库健康指标
  database: {
    connectionPool: number;
    queryPerformance: number;
    replicationLag: number;
  };
}

export interface HealthScoreWeights {
  performance: number; // 性能健康 30%
  stability: number; // 稳定性健康 25%
  security: number; // 安全健康 20%
  maintainability: number; // 可维护性 15%
  efficiency: number; // 执行效率 10%
}

export type RecommendationPriority = 'low' | 'medium' | 'high';
export type RecommendationType =
  | 'performance'
  | 'stability'
  | 'security'
  | 'maintainability'
  | 'efficiency';

export interface Recommendation {
  type: RecommendationType;
  priority: RecommendationPriority;
  title: string;
  description: string;
  action: string;
  expectedImprovement: string;
  effort: 'low' | 'medium' | 'high';
  path?: string;
}

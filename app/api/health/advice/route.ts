/**
 * @file 健康建议 API
 * @description 根据采样的路由指标（p95、错误占比）生成优化建议列表
 * @module api/health/advice
 * @author YYC
 */
import { NextRequest, NextResponse } from 'next/server';
import { ApiHealth } from '@/lib/api-health';
import { RouteHealth } from '@/lib/health-monitor';

export const GET = ApiHealth.monitorRoute(
  async (req: NextRequest) => {
    const recommendations = RouteHealth.generateRecommendations();
    return NextResponse.json({ ok: true, recommendations });
  },
  { category: 'normal', performanceThresholdMs: 1000 }
);

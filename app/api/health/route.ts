/**
 * @description 系统健康检查 API 路由
 * @project YYC AI Chat
 */
import { NextRequest, NextResponse } from 'next/server';
import { HealthMonitor } from '@/lib/health-monitor';
import { ApiHealth } from '@/lib/api-health';

export const GET = ApiHealth.monitorRoute(async (req: NextRequest) => {
  const metrics = HealthMonitor.sample();
  return NextResponse.json({ ok: true, metrics });
}, { category: 'auto' });

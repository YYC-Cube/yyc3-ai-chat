/**
 * @description 系统健康检查 API 路由
 * @project YYC AI Chat
 */
import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';

import { ApiHealth } from '@/lib/api-health';
import { HealthMonitor } from '@/lib/health-monitor';

export const GET = ApiHealth.monitorRoute(
  async (req: NextRequest) => {
    const metrics = HealthMonitor.sample();
    return NextResponse.json({ ok: true, metrics });
  },
  { category: 'auto' }
);

/**
 * @file 告警链路验证路由
 * @description 通过性能阈值与错误触发，验证 Slack/Sentry 双路告警是否正常
 * @module api/alerts-test
 * @author YYC
 */
import { NextRequest, NextResponse } from 'next/server';
import { ApiHealth } from '@/lib/api-health';

export const GET = ApiHealth.monitorRoute(
  async (req: NextRequest) => {
    const url = new URL(req.url);
    const type = url.searchParams.get('type'); // 'perf' | 'error'

    if (type === 'error') {
      throw new Error('链路验证错误：这是一个测试错误');
    }

    // 人为延时以触发性能告警（heavy 阈值为 500ms）
    await new Promise((r) => setTimeout(r, 600));

    return NextResponse.json({ ok: true, test: type || 'perf' });
  },
  { category: 'heavy', performanceThresholdMs: 500 }
);

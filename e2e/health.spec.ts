import { test, expect } from './test-base';

// 等待服务启动后进行健康检查
test('GET /api/health 应该返回 ok 与指标', async ({ request, baseURL }) => {
  const res = await request.get(`${baseURL}/api/health`);
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json).toMatchObject({ ok: true });
  // 可选字段存在性检查（宽松）
  expect(json).toHaveProperty('metrics');
  const t = json?.metrics?.responseTime;
  if (typeof t === 'number') expect(t).toBeGreaterThanOrEqual(0);
});

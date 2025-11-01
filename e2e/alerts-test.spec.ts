import { test, expect } from './test-base';

function hasSlackWebhook() {
  const envs = [
    process.env.SLACK_WEBHOOK_URL,
    process.env.SLACK_WEBHOOK_URL_NORMAL,
    process.env.SLACK_WEBHOOK_URL_HEAVY,
    process.env.SLACK_WEBHOOK_URL_ERRORS,
  ];
  return envs.some((v) => typeof v === 'string' && v.trim().length > 0);
}

const shouldRun = hasSlackWebhook() && process.env.NODE_ENV !== 'production';

test.skip(!shouldRun, '未配置分组 webhook 或生产环境，跳过 alerts-test 轻量校验');

test('GET /api/alerts-test (perf) 触发性能路径', async ({ request, baseURL }) => {
  const res = await request.get(`${baseURL}/api/alerts-test`);
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json).toMatchObject({ ok: true });
});

test('GET /api/alerts-test?type=error 触发错误路径', async ({ request, baseURL }) => {
  const res = await request.get(`${baseURL}/api/alerts-test?type=error`);
  expect(res.status()).toBe(500);
  const json = await res.json();
  expect(json).toMatchObject({ ok: false });
});

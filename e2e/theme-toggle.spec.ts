import { test, expect } from './test-base';

/**
 * @description 主题切换按钮 e2e（移除 networkidle，改为直接等待按钮可见）
 * @author YYC
 * @created 2025-11-01
 */

test('主题切换切换 data-theme', async ({ page }) => {
  await page.goto('http://localhost:3003/');

  // 直接等待主题切换按钮可见（Sidebar 底部或移动端导航均会渲染）
  const toggleBtn = page.locator('button[aria-label="Toggle theme"]');
  await expect(toggleBtn.first()).toBeVisible({ timeout: 10000 });

  // 读取初始主题并执行切换
  const initialTheme = await page.locator('html').getAttribute('data-theme');
  await toggleBtn.first().click();

  // 断言切换后主题发生变化
  await expect.poll(async () => {
    return await page.locator('html').getAttribute('data-theme');
  }, { timeout: 5000 }).not.toBe(initialTheme);
});
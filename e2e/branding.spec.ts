import { test, expect } from './test-base';

/**
 * @description 品牌展示用例：首页不包含品牌横幅与徽章；/brand-preview 包含并声明暗/亮主题资源
 * @author YYC
 */

test('品牌展示迁移至 /brand-preview，首页不再包含横幅与徽章', async ({ page }) => {
  // 首页不应存在品牌横幅与徽章
  await page.goto('/');
  await expect(page.locator('picture[data-testid="brand-banner"]')).toHaveCount(0);
  await expect(page.locator('[data-testid="tool-badges"]')).toHaveCount(0);

  // 品牌预览页包含横幅与徽章
  await page.goto('/brand-preview');
  const banner = page.locator('picture');
  await expect(banner).toBeVisible();
  const darkSrc = await banner
    .locator('source[media="(prefers-color-scheme: dark)"]')
    .getAttribute('srcset');
  const lightSrc = await banner
    .locator('source[media="(prefers-color-scheme: light)"]')
    .getAttribute('srcset');
  expect(darkSrc).toBe('/Github-Nexus.png');
  expect(lightSrc).toBe('/Git-Expansion.png');
});

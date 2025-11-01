import { test, expect } from './test-base';

/**
 * @description 会话移动到文件夹 e2e
 * @author YYC
 * @created 2025-11-01
 */

test('将新建会话移动到 Personal 文件夹', async ({ page }) => {
  await page.goto('http://localhost:3003/');

  // 新建会话（使用快捷键 ⌘N）
  await page.keyboard.press('Meta+N');

  // 在侧边栏中选中“当前活动会话行”，兼容浅色/深色主题（bg-zinc-100 或 dark:bg-zinc-800/60）
  const nav = page.locator('nav');
  const row = nav.locator(':is([role="button"].bg-zinc-100, [role="button"].dark\\:bg-zinc-800\\/60)').first();
  await expect(row).toBeVisible();

  // 打开更多选项菜单并执行移动（增加显式可见断言）
  await row.hover();
  const moreBtn = row.getByRole('button', { name: /(更多选项|More Options)/ });
  await expect(moreBtn).toBeVisible({ timeout: 5000 });
  await moreBtn.click();

  const moveBtn = page.getByRole('button', { name: /(移动到文件夹|Move to folder)/ });
  await expect(moveBtn).toBeVisible({ timeout: 5000 });
  await moveBtn.click();
  const personalFolder = page.getByRole('button', { name: 'Personal' });
  await expect(personalFolder).toBeVisible({ timeout: 5000 });
  await personalFolder.click();

  // 展开 Personal 文件夹并断言会话存在（显式等待展开按钮可见）
  const expandBtn = page.getByRole('button', { name: /(展开文件夹|Expand folder)/ }).filter({ hasText: 'Personal' });
  await expect(expandBtn).toBeVisible({ timeout: 5000 });
  await expandBtn.click();
  await expect(page.getByText(/(新建会话|New Chat)/)).toBeVisible();
});
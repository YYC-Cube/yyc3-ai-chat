import { test, expect } from './test-base';

/**
 * @description 导出会话为 Markdown e2e
 * @author YYC
 * @created 2025-11-01
 */

test('导出新建会话为 Markdown', async ({ page }) => {
  await page.goto('http://localhost:3003/');

  // 新建会话（使用快捷键 ⌘N）
  await page.keyboard.press('Meta+N');

  // 输入并发送消息，确保导出内容存在
  const input = page.getByPlaceholder(/(请输入内容|Type your message)/);
  await input.fill('请导出这条消息为 Markdown');
  await page.keyboard.press('Enter');

  // 在侧边栏选中“当前活动会话行”，兼容浅色/深色主题
  const nav = page.locator('nav');
  const row = nav
    .locator(':is([role="button"].bg-zinc-100, [role="button"].dark\\:bg-zinc-800\\/60)')
    .first();
  await expect(row).toBeVisible();

  // 打开更多选项 -> 导出（显式等待菜单按钮与操作项可见）
  await row.hover();
  const moreBtn = row.getByRole('button', { name: /(更多选项|More Options)/ });
  await expect(moreBtn).toBeVisible({ timeout: 5000 });
  await moreBtn.click();

  const exportBtn = page.getByRole('button', { name: /(导出|Export)/ });
  await expect(exportBtn).toBeVisible({ timeout: 5000 });
  await exportBtn.click();

  // 断言导出成功的 toast 文案（来自 AIAssistantUI.jsx）
  await expect(
    page.getByText(/(会话已导出为\s*Markdown|Conversation exported as Markdown)/)
  ).toBeVisible();
});

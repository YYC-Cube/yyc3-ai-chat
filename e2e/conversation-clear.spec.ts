import { test, expect } from './test-base';

/**
 * @description 清空会话 e2e
 * @author YYC
 * @created 2025-11-01
 */

test('清空新建会话后统计应为 0 条消息', async ({ page }) => {
  await page.goto('http://localhost:3003/');

  // 新建会话（使用快捷键 ⌘N）
  await page.keyboard.press('Meta+N');

  // 先发送一条消息以确保清空操作可见
  const input = page.getByPlaceholder(/(请输入内容|Type your message)/);
  await input.fill('要清空的消息');
  await page.keyboard.press('Enter');

  // 在侧边栏中选中“当前活动会话行”，兼容浅色/深色主题
  const nav = page.locator('nav');
  const row = nav
    .locator(':is([role="button"].bg-zinc-100, [role="button"].dark\\:bg-zinc-800\\/60)')
    .first();
  await expect(row).toBeVisible();

  // 打开更多选项并清空会话（显式等待菜单按钮与操作项可见）
  await row.hover();
  const moreBtn = row.getByRole('button', { name: /(更多选项|More Options)/ });
  await expect(moreBtn).toBeVisible({ timeout: 5000 });
  await moreBtn.click();

  const clearBtn = page.getByRole('button', { name: /(清空会话|Clear Conversation)/ });
  await expect(clearBtn).toBeVisible({ timeout: 5000 });
  await clearBtn.click();

  // 校验消息数为 0（来自 ChatPane 统计）
  await expect(page.getByText(/0\s*条消息|0\s*messages/)).toBeVisible();
});

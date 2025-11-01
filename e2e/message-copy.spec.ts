import { test, expect } from './test-base';


/**
 * @description 复制消息 e2e（授予剪贴板权限）
 * @author YYC
 * @created 2025-11-01
 */



test('复制消息内容到剪贴板', async ({ page, context }) => {
  await page.goto('http://localhost:3003/');

  // 授予剪贴板权限（Chromium）
  // 剪贴板权限已在全局 use.permissions 配置，无需重复授予

  // 新建会话，并发送消息
  // 新建会话（使用快捷键 ⌘N）
  await page.keyboard.press('Meta+N')
  const input = page.getByPlaceholder(/(请输入内容|Type your message)/);
  await input.click();
  await input.type('复制测试消息');
  await page.keyboard.press('Enter');

  // 点击“复制”按钮
  await page.getByRole('button', { name: '复制' }).first().click();

  // 读取剪贴板并断言
  const copied = await page.evaluate(async () => {
    return await navigator.clipboard.readText();
  });
  expect(copied).toContain('复制测试消息');
});

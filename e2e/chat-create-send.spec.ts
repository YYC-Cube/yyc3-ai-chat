import { test, expect } from './test-base';





test('新建会话并发送消息', async ({ page }) => {
  await page.goto('/')

  // 新建会话（使用快捷键 ⌘N，跨布局更稳健）
  await page.keyboard.press('Meta+N')

  // 输入消息并发送（兼容中英文占位符）
  const input = page.getByPlaceholder(/(请输入内容|Type your message)/)
  await input.click()
  await input.fill('你好 Playwright')

  const sendBtn = page.getByRole('button', { name: /(发送|Send)/ })
  await expect(sendBtn).toBeEnabled()
  await sendBtn.click()

  // 断言输入框已清空
  await expect(input).toHaveValue('')
})
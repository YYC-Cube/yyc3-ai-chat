import { test, expect } from './test-base';




test('首页渲染并具有语言属性', async ({ page }) => {
  await page.goto('/')
  // 检查 <html lang="zh-CN"> 存在
  const lang = await page.evaluate(() => document.documentElement.lang)
  expect(lang).toBe('zh-CN')

  // 截图快照（仅失败保存，配置已设置）
  await expect(page).toHaveTitle(/YYC³ AI|yyc3-ai-programming/i)
})
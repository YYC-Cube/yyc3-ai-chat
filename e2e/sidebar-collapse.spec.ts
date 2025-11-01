import { test, expect } from './test-base';


test('侧边栏折叠与展开按钮', async ({ page }) => {
  await page.goto('/')
  // 点击关闭侧边栏（中文环境）
  const closeBtn = page.getByRole('button', { name: '关闭侧边栏' })
  if (await closeBtn.isVisible()) {
    await closeBtn.click()
  }

  // 如果存在“打开侧边栏”按钮（移动端/折叠视图），则点击并验证回到关闭按钮可见
  const openBtn = page.getByRole('button', { name: '打开侧边栏' })
  if (await openBtn.isVisible()) {
    await openBtn.click()
    await expect(page.getByRole('button', { name: '关闭侧边栏' })).toBeVisible()
  } else {
    // 桌面折叠视图下没有“打开侧边栏”按钮，验证关闭按钮不可见即可
    await expect(page.getByRole('button', { name: '关闭侧边栏' })).not.toBeVisible()
  }
})
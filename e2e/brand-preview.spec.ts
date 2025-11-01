import { test, expect } from './test-base';


test('brand-preview 页面包含横幅与徽章，并声明暗/亮主题资源', async ({ page }) => {
  await page.goto('/brand-preview')

  const banner = page.locator('picture')
  await expect(banner).toBeVisible()

  const darkSrc = await banner.locator('source[media="(prefers-color-scheme: dark)"]').getAttribute('srcset')
  const lightSrc = await banner.locator('source[media="(prefers-color-scheme: light)"]').getAttribute('srcset')
  expect(darkSrc).toBe('/Github-Nexus.png')
  expect(lightSrc).toBe('/Git-Expansion.png')

  const badgesImg = page.getByRole('img', { name: 'Next.js 15.2' })
  await expect(badgesImg).toBeVisible()
})


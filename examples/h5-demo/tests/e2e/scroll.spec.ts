import { test, expect } from '@playwright/test'

test('auto-scroll: off-screen target is brought into view', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.click('text=Start scroll')
  await expect(page.locator('.ugt-hole')).toBeVisible()
  const scrollY = await page.evaluate(() => window.scrollY)
  expect(scrollY).toBeGreaterThan(100)
})

import { test, expect } from '@playwright/test'

test('missing target triggers onError and pauses', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Start missing')
  await page.waitForTimeout(300)
  const code = await page.evaluate(() => (window as any).__lastGuideError)
  expect(code).toBe('TARGET_NOT_FOUND')
  await expect(page.locator('.ugt-root')).toHaveCount(0)
})

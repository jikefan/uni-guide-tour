import { test, expect } from '@playwright/test'

test('basic 5-step tour completes', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Start tour')

  for (let i = 1; i <= 5; i++) {
    await expect(page.locator('.ugt-tip__title')).toContainText(`Step ${i}`)
    await page.click('.ugt-tip__next')
  }
  await expect(page.locator('.ugt-root')).toHaveCount(0)
})

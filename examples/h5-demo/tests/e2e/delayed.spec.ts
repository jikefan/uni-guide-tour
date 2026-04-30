import { test, expect } from '@playwright/test'

test('delayed target eventually appears via retries', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Start delayed')
  await page.click('.ugt-tip__next')
  await expect(page.locator('.ugt-tip__title')).toContainText('Delayed page', { timeout: 4000 })
})

import { test, expect } from '@playwright/test'

test('completed tour can be restarted via force', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Start tour')
  for (let i = 0; i < 5; i++) await page.click('.ugt-tip__next')
  await expect(page.locator('.ugt-root')).toHaveCount(0)

  // Plain Start tour again — completed, should be no-op
  await page.goto('/')
  await page.click('text=Start tour')
  await expect(page.locator('.ugt-root')).toHaveCount(0)

  // Force restart — should restart from Step 1
  await page.click('text=Restart (force)')
  await expect(page.locator('.ugt-tip__title')).toContainText('Step 1')
})

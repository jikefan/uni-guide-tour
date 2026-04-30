import { test, expect } from '@playwright/test'

test('refresh mid-tour resumes from same step', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Start tour')
  await page.click('.ugt-tip__next')                     // → step 2
  await page.click('.ugt-tip__next')                     // → step 3 (page2)
  await expect(page).toHaveURL(/\/pages\/page2/)
  await page.reload()
  await expect(page).toHaveURL(/\/pages\/page2/)
  await expect(page.locator('.ugt-tip__title')).toContainText('Step 3')
})

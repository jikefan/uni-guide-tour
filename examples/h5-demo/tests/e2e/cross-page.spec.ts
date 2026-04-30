import { test, expect } from '@playwright/test'

test('cross-page tour navigates and shows mask on each page', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Start tour')
  await expect(page).toHaveURL(/\/pages\/home/)
  await page.click('.ugt-tip__next')
  await page.click('.ugt-tip__next')
  await expect(page).toHaveURL(/\/pages\/page2/)
  await expect(page.locator('.ugt-tip__title')).toContainText('Step 3')
  await page.click('.ugt-tip__next')
  await expect(page).toHaveURL(/\/pages\/page3/)
  await expect(page.locator('.ugt-tip__title')).toContainText('Step 4')
})

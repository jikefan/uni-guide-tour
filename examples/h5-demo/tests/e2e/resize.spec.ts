import { test, expect } from '@playwright/test'

test('mask relocates on window resize', async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 600 })
  await page.goto('/')
  await page.click('text=Start tour')
  const before = await page.locator('.ugt-hole').boundingBox()
  await page.setViewportSize({ width: 400, height: 600 })
  await page.waitForTimeout(400)
  const after = await page.locator('.ugt-hole').boundingBox()
  // Either x or width must change after viewport resize triggers engine.relocate()
  const moved = (after?.x !== before?.x) || (after?.width !== before?.width)
  expect(moved).toBe(true)
})

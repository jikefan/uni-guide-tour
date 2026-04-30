import { test, expect } from '@playwright/test'

test('auto-scroll: off-screen target is brought into view', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.click('text=Start scroll')
  await expect(page.locator('.ugt-hole')).toBeVisible()
  // Engine auto-scrolled the off-screen target into view — verify both:
  // (1) document scroll happened (engine.pageScrollTo ran)
  // (2) target is now within viewport (the user-facing goal, browser-agnostic).
  const scrollY = await page.evaluate(() => window.scrollY)
  expect(scrollY).toBeGreaterThan(0)
  await expect(page.locator('[data-guide-target="card-bottom"]')).toBeInViewport()
})

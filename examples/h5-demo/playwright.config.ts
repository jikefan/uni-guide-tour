import { defineConfig } from '@playwright/test'

const PORT = process.env.E2E_PORT ? Number(process.env.E2E_PORT) : 5173

export default defineConfig({
  testDir: './tests/e2e',
  webServer: {
    command: `pnpm dev --port ${PORT}`,
    port: PORT,
    reuseExistingServer: true,
    timeout: 90_000,
  },
  use: {
    baseURL: `http://localhost:${PORT}`,
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
  reporter: process.env.CI ? 'github' : 'list',
})

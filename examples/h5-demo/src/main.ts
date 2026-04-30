import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import { createGuide } from 'uni-guide-tour'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  app.use(createPinia())
  app.use(createGuide())
  return { app }
}

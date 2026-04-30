import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'uni-guide-tour',
  description: 'Multi-platform guided tour SDK for uniapp + Vue 3',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/quick-start' },
      { text: 'GitHub', link: 'https://github.com/jikefan/uni-guide-tour' },
    ],
    sidebar: {
      '/guide/': [
        { text: 'Getting Started', items: [
          { text: 'Quick Start', link: '/guide/quick-start' },
          { text: 'Tour Schema', link: '/guide/tour-schema' },
          { text: 'API Reference', link: '/guide/api' },
        ]},
        { text: 'Topics', items: [
          { text: 'Recipes', link: '/guide/recipes' },
          { text: 'FAQ', link: '/guide/faq' },
        ]},
      ],
    },
  },
})

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['@typescript-eslint', 'vue'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
  ],
  ignorePatterns: [
    'dist',
    'node_modules',
    '.vitepress',
    'unpackage',
    'playwright-report',
    'test-results',
    '.changeset',
  ],
  rules: {
    // Library exposes generic adapter shapes; allow `any` for flexibility
    '@typescript-eslint/no-explicit-any': 'off',
    // uniapp/Vue3 components often use single-word names (page-level)
    'vue/multi-word-component-names': 'off',
  },
  overrides: [
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: { parser: '@typescript-eslint/parser' },
    },
  ],
}

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

const unusedVars = ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^[A-Z_]' }]

export default defineConfig([
  globalIgnores(['dist']),
  {
    // ฝั่ง Client (React)
    files: ['src/**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: { 'no-unused-vars': unusedVars },
  },
  {
    // ฝั่ง Server (Node.js / Express) และโค้ดที่ใช้ร่วมกัน
    files: ['server/**/*.js', 'shared/**/*.js', '*.config.js'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
    rules: { 'no-unused-vars': unusedVars },
  },
])

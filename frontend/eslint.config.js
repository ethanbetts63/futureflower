import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

// react-refresh's vite preset used to be extended here. Its only-export-components
// rule exists for Vite's Fast Refresh boundaries and fires on every App Router
// page that exports `metadata` alongside its component — i.e. on idiomatic Next.
// Next ships its own Fast Refresh, so the rule was 22 false positives and nothing else.
export default defineConfig([
  globalIgnores(['dist', '.next']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // `const { confirm_password, ...data } = form` is how you omit a key.
      // The binding is meant to be unused; that is the point of it.
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
  },
])

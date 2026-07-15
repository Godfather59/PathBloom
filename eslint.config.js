import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist/**', 'android/app/build/**', 'android/app/src/main/assets/**']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettierConfig,
    ],
    plugins: {
      prettier,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': [
        'error',
        { varsIgnorePattern: '^[A-Z_]', args: 'none', caughtErrors: 'none' },
      ],
      'no-case-declarations': 'off',
      'no-console': ['warn', { allow: ['warn', 'error', 'log'] }],
      'no-debugger': 'error',
      'no-alert': 'off',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      eqeqeq: 'off',
      curly: ['error', 'all'],
      'brace-style': 'off',
      'no-else-return': 'error',
      'no-nested-ternary': 'off',
      'no-empty': 'off',
      'no-unneeded-ternary': 'error',
      'no-lonely-if': 'off',
      'no-useless-return': 'error',
      'object-shorthand': ['error', 'always'],
      'prefer-destructuring': ['error', { object: true, array: false }],
      'no-duplicate-imports': 'error',
      'no-useless-concat': 'error',
      'no-throw-literal': 'error',
      'prefer-promise-reject-errors': 'error',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/exhaustive-deps': 'off',
    },
  },
]);

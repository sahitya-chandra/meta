// eslint.config.mjs (root)
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  // Base configuration for all files
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/build/**',
      'apps/web/**', // Exclude web app - it has its own config
    ],
  },
  
  // JavaScript files configuration
  {
    files: ['**/*.js', '**/*.mjs'],
    ...js.configs.recommended,
  },
  
  // TypeScript files configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json', './apps/server/tsconfig.json', './packages/*/tsconfig.json'],
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      
      // Custom rules for monorepo
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_' 
      }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      
      // General rules
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  
  // Server-specific rules
  {
    files: ['apps/server/**/*.ts'],
    rules: {
      'no-console': 'off', // Allow console in server
    },
  },
  
  // Package-specific rules
  {
    files: ['packages/**/*.ts'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error', // Stricter for packages
    },
  },
];
import tseslint from 'typescript-eslint'
// @ts-expect-error - ESLint plugins may not have proper types
import reactPlugin from 'eslint-plugin-react'
// @ts-expect-error - ESLint plugins may not have proper types
import reactHooksPlugin from 'eslint-plugin-react-hooks'

export default tseslint.config([
  // Global ignores
  {
    ignores: [
      'dist/**/*',
      '.storybook/**/*',
      'node_modules/**/*',
      'coverage/**/*',
      'android/**/*',
      'ios/**/*',
      '.expo/**/*',
      '.yarn/**/*',
      'babel.config.js',
      'metro.config.js',
      'jest.config.ts',
    ],
  },

  // Base TypeScript configuration
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,

  // Main configuration for all TypeScript/JavaScript files
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Node.js globals
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        // Browser/React Native globals
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        fetch: 'readonly',
        FormData: 'readonly',
        // Jest globals
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
      },
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': 'allow-with-description',
          'ts-nocheck': 'allow-with-description',
          'ts-check': false,
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/no-require-imports': 'off',

      // General JavaScript/TypeScript rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-alert': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      'prefer-arrow-callback': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'no-duplicate-imports': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      curly: ['error', 'all'],
      'no-else-return': 'error',
      'no-lonely-if': 'error',
      'prefer-destructuring': [
        'error',
        {
          array: false,
          object: true,
        },
      ],

      // Code quality
      complexity: ['warn', 15],
      'max-depth': ['warn', 4],
      'max-lines': ['warn', { max: 500, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': [
        'warn',
        { max: 150, skipBlankLines: true, skipComments: true },
      ],
      'max-params': ['warn', 5],
      'no-nested-ternary': 'warn',
    },
  },

  // React/React Native specific configuration
  {
    files: ['**/*.{tsx,jsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      // Note: react-native plugin has compatibility issues with ESLint 9
      // Disabling for now until plugin is updated
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // React rules
      'react/jsx-uses-react': 'off', // Not needed in React 17+
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/prop-types': 'off', // Using TypeScript for prop validation
      'react/display-name': 'warn',
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/jsx-pascal-case': 'error',
      'react/no-children-prop': 'error',
      'react/no-danger-with-children': 'error',
      'react/no-deprecated': 'warn',
      'react/no-direct-mutation-state': 'error',
      'react/no-unescaped-entities': 'warn',
      'react/no-unknown-property': 'error',
      'react/self-closing-comp': 'error',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'react/jsx-fragments': ['error', 'syntax'],
      'react/jsx-no-useless-fragment': 'warn',

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // React Native specific rules (manual implementation)
      // Note: eslint-plugin-react-native is not compatible with ESLint 9 yet
      // These are basic rules to maintain code quality for React Native
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['react-native-web'],
              message: 'This is a React Native project, not React Native Web',
            },
          ],
        },
      ],
    },
  },

  // Test files configuration
  {
    files: ['**/__tests__/**/*', '**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'max-lines-per-function': 'off',
      'max-lines': 'off',
      'no-console': 'off',
    },
  },

  // Storybook files configuration
  {
    files: ['**/*.stories.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'max-lines-per-function': 'off',
    },
  },

  // Configuration files
  {
    files: ['*.config.{js,ts}', '*.setup.{js,ts}'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'no-console': 'off',
    },
  },
])

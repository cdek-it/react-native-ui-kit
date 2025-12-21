import { defineConfig } from 'eslint/config'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'

// eslint-disable-next-line import-x/no-named-as-default
import importX, { createNodeResolver } from 'eslint-plugin-import-x'

export const importConfig = defineConfig([
  {
    files: ['**/*.{js,jsx,cjs,mjs,ts,tsx,mts,cts}'],
    // @ts-expect-error Типизация Plugin Import-X не совпадает с типизацией которую ожидает ESLint
    plugins: { 'import-x': importX },
    settings: {
      'import-x/extensions': ['.ts', '.tsx', '.js', '.jsx'],
      'import-x/external-module-folders': [
        'node_modules',
        'node_modules/@types',
      ],
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          project: ['tsconfig.json'],
        }),
        createNodeResolver(),
      ],
    },
    rules: {
      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/export.md
      'import-x/export': 'error',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-deprecated.md
      'import-x/no-deprecated': 'warn',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-empty-named-blocks.md
      'import-x/no-empty-named-blocks': 'error',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-extraneous-dependencies.md
      'import-x/no-extraneous-dependencies': [
        'error',
        { whitelist: ['@jest/globals', '@expo/config-plugins'] },
      ],

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-mutable-exports.md
      'import-x/no-mutable-exports': 'error',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-named-as-default.md
      'import-x/no-named-as-default': 'warn',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-named-as-default-member.md
      'import-x/no-named-as-default-member': 'off',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-rename-default.md
      'import-x/no-rename-default': 'off',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-unused-modules.md
      'import-x/no-unused-modules': 'off',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-amd.md
      'import-x/no-amd': 'off',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-commonjs.md
      'import-x/no-commonjs': 'off',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-import-module-exports.md
      'import-x/no-import-module-exports': 'off',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-nodejs-modules.md
      'import-x/no-nodejs-modules': 'error',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/unambiguous.md
      'import-x/unambiguous': 'off',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/default.md
      'import-x/default': 'error',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/named.md
      'import-x/named': 'off',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/namespace.md
      'import-x/namespace': 'error',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-absolute-path.md
      'import-x/no-absolute-path': 'error',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-cycle.md
      'import-x/no-cycle': ['error', { ignoreExternal: true, maxDepth: 20 }],

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-dynamic-require.md
      'import-x/no-dynamic-require': 'off',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-internal-modules.md
      'import-x/no-internal-modules': 'off',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-relative-packages.md
      'import-x/no-relative-packages': 'off',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-relative-parent-imports.md
      'import-x/no-relative-parent-imports': 'off',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-restricted-paths.md
      'import-x/no-restricted-paths': 'off',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-self-import.md
      'import-x/no-self-import': 'error',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-unresolved.md
      'import-x/no-unresolved': 'error',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-useless-path-segments.md
      'import-x/no-useless-path-segments': 'error',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-webpack-loader-syntax.md
      'import-x/no-webpack-loader-syntax': 'error',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/consistent-type-specifier-style.md
      'import-x/consistent-type-specifier-style': 'off',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/dynamic-import-chunkname.md
      'import-x/dynamic-import-chunkname': 'off',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/exports-last.md
      'import-x/exports-last': 'off',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/extensions.md
      'import-x/extensions': [
        'error',
        'never',
        { json: 'always', png: 'always', jpg: 'always', mjs: 'always' },
      ],

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/first.md
      'import-x/first': 'error',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/group-exports.md
      'import-x/group-exports': 'off',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/imports-first.md
      'import-x/imports-first': 'off',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/max-dependencies.md
      'import-x/max-dependencies': [
        'warn',
        { max: 40, ignoreTypeImports: true },
      ],

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/newline-after-import.md
      'import-x/newline-after-import': [
        'error',
        { count: 1, exactCount: true, considerComments: true },
      ],

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-anonymous-default-export.md
      'import-x/no-anonymous-default-export': 'error',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-default-export.md
      'import-x/no-default-export': 'error',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-duplicates.md
      'no-duplicate-imports': 'off',
      'import-x/no-duplicates': ['error', { 'prefer-inline': true }],

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-named-default.md
      'import-x/no-named-default': 'error',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-named-export.md
      'import-x/no-named-export': 'off',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-namespace.md
      'import-x/no-namespace': 'warn',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-unassigned-import.md
      'import-x/no-unassigned-import': 'off',

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/order.md
      'import-x/order': [
        'error',
        {
          alphabetize: { order: 'asc' },
          'newlines-between': 'always-and-inside-groups',
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'unknown',
          ],
          warnOnUnassignedImports: true,
          pathGroups: [
            { pattern: '~/**', group: 'internal' },
            { pattern: '@/**', group: 'internal' },
            { pattern: './**', group: 'sibling' },
          ],
        },
      ],

      // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/prefer-default-export.md
      'import-x/prefer-default-export': 'off',
    },
  },
  {
    files: ['**/*.stories.{js,jsx,cjs,mjs,ts,tsx,mts,cts}'],
    rules: { 'import-x/no-default-export': 'off' },
  },
  {
    files: [
      'eslint.config.*',
      'jest.config.*',
      'jest.setup.*',
      'babel.config.*',
      'metro.config.*',
      'expo/plugins/**/*',
      'app.config.*',
      '**/*.d.ts',
      'eslint/**',
      '*prettier.config*',
    ],
    rules: {
      'import-x/no-namespace': 'off',
      'import-x/no-default-export': 'off',
      'import-x/no-named-as-default-member': 'off',
      'import-x/no-anonymous-default-export': 'off',
      'import-x/no-nodejs-modules': 'off',
    },
  },
])

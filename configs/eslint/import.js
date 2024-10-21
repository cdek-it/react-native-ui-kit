/**
 * Import plugin rules
 * @see {@link https://github.com/import-js/eslint-plugin-import}
 */
module.exports = {
  /**
   * Recommended rules for TypeScript from Import plugin
   * @see {@link https://github.com/import-js/eslint-plugin-import#typescript}
   */
  extends: ['plugin:import/typescript'],
  plugins: ['import'],
  rules: {
    /**
     * Disallow empty import blocks
     * @see {@link https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-empty-named-blocks.md}
     */
    'import/no-empty-named-blocks': 'error',
    /**
     * Disallow exports of var and let variables
     * @see {@link https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-mutable-exports.md}
     */
    'import/no-mutable-exports': 'error',
    /**
     * Disallow unused modules in project
     * @see {@link https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-unused-modules.md}
     */
    'import/no-unused-modules': 'error',
    /**
     * Disallow absolute path imports
     * @see {@link https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-absolute-path.md}
     */
    'import/no-absolute-path': 'error',
    /**
     * Disallow import cycles
     * @see {@link https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-cycle.md}
     */
    'import/no-cycle': 'error',
    /**
     * Disallow self imports
     * @see {@link https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-self-import.md}
     */
    'import/no-self-import': 'error',
    /**
     * Disallow unnecessary path segments in imports
     * @see {@link https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-useless-path-segments.md}
     */
    'import/no-useless-path-segments': 'error',
    /**
     * Enforce imports to be at top of file
     * @see {@link https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/first.md}
     */
    'import/first': 'error',
    /**
     * Limit number of dependencies per module
     * TODO:: Decide if this rule should be enabled or disabled
     * TODO:: Reduce number of dependencies per module
     * @see {@link https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/max-dependencies.md}
     */
    'import/max-dependencies': ['off', { max: 40, ignoreTypeImports: true }],
    /**
     * Enforce newline after imports
     * @see {@link https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/newline-after-import.md}
     */
    'import/newline-after-import': 'error',
    /**
     * Disallow duplicated imports and enforce inline type imports
     * @see {@link https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-duplicates.md}
     */
    'import/no-duplicates': ['error', { 'prefer-inline': true }],
    /**
     * Disallow namespace imports
     * @see {@link https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-namespace.md}
     */
    'import/no-namespace': 'error',
    /**
     * Enforce ordering of imports
     * @see {@link https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md}
     */
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
        },
        'newlines-between': 'always',
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'unknown'],
        pathGroups: [
          {
            pattern: '~/**',
            group: 'internal',
          },
          {
            pattern: './**',
            group: 'sibling',
          },
        ],
      },
    ],
  },
}

/**
 * Prettier rules
 * @see {@link https://prettier.io/docs/en/options}
 */
module.exports = {
  /**
   * Recommended rules from Prettier plugin
   * @see {@link https://prettier.io/docs/en/integrating-with-linters}
   */
  extends: ['plugin:prettier/recommended'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        printWidth: 100,
        tabWidth: 2,
        useTabs: false,
        semi: false,
        singleQuote: true,
        jsxSingleQuote: true,
        trailingComma: 'es5',
        bracketSpacing: true,
        bracketSameLine: false,
        arrowParens: 'always',
        parser: 'typescript',
      },
    ],
  },
}

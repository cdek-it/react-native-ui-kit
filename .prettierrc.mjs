const /** @type {import("prettier").Config} */ config = {
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
    semi: false,
    singleQuote: true,
    trailingComma: 'es5',
    arrowParens: 'always',
    jsxSingleQuote: true,
    bracketSpacing: true,
    bracketSameLine: false,
    objectWrap: 'collapse',
    quoteProps: 'as-needed',
    requirePragma: false,
    proseWrap: 'always',
    overrides: [
      { files: ['*.tsx'], options: { parser: 'babel-ts' } },
      { files: ['*.ts', '*.mts', '*.cts'], options: { parser: 'typescript' } },
      {
        files: ['*.js', '*.jsx', '*.cjs', '*.mjs'],
        options: { parser: 'babel' },
      },
      { files: ['*.md'], options: { parser: 'markdown' } },
      { files: ['*.yml'], options: { parser: 'yaml' } },
    ],
  }

export default config

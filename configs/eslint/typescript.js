/**
 * TypeScript ESLint rules
 * @see {@link https://typescript-eslint.io/rules/}
 */
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  /**
   * Recommended rules from TypeScript ESLint
   * @see {@link https://typescript-eslint.io/linting/configs/#recommended}
   */
  extends: ['plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint'],
  rules: {
    /**
     * Enforce T[] array type annotations for simple types and Array<T> for complex and union types
     * @see {@link https://typescript-eslint.io/rules/array-type}
     */
    '@typescript-eslint/array-type': [
      'error',
      {
        default: 'array-simple',
      },
    ],
    /**
     * Emit errors for unnecessary awaits
     * @see {@link https://typescript-eslint.io/rules/await-thenable}
     */
    '@typescript-eslint/await-thenable': 'error',
    /**
     * Allow ts-ignore and similar annotations only with description why it is used
     * @override Overrides rule from typescript-eslint/eslint-recommended
     * @see {@link https://typescript-eslint.io/rules/ban-ts-comment}
     */
    '@typescript-eslint/ban-ts-comment': ['error', { 'ts-expect-error': 'allow-with-description' }],
    /**
     * Enforce consistent type annotations for generic classes
     * @see {@link https://typescript-eslint.io/rules/consistent-generic-constructors}
     */
    '@typescript-eslint/consistent-generic-constructors': 'error',
    /**
     * Enforce consistent type annotations for indexed signatures
     * @see {@link https://typescript-eslint.io/rules/consistent-indexed-object-style}
     */
    '@typescript-eslint/consistent-indexed-object-style': 'error',
    /**
     * Enforce consistent type assertions
     * @see {@link https://typescript-eslint.io/rules/consistent-type-assertions}
     */
    '@typescript-eslint/consistent-type-assertions': 'error',
    /**
     * Enforce consistent type definitions
     * @see {@link https://typescript-eslint.io/rules/consistent-type-definitions}
     */
    '@typescript-eslint/consistent-type-definitions': 'error',
    /**
     * Enforce consistent usage of type exports
     * @see {@link https://typescript-eslint.io/rules/consistent-type-exports}
     */
    '@typescript-eslint/consistent-type-exports': [
      'error',
      { fixMixedExportsWithInlineTypeSpecifier: true },
    ],
    /**
     * Enforce consistent usage of type imports
     * @see {@link https://typescript-eslint.io/rules/consistent-type-imports}
     */
    '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
    /**
     * Disable explicit type declarations for function return types as compiler can infer them
     * @see {@link https://typescript-eslint.io/rules/explicit-function-return-type}
     */
    '@typescript-eslint/explicit-function-return-type': 'off',
    /**
     * Disable explicit type declarations for exported variables and functions
     * @see {@link https://typescript-eslint.io/rules/explicit-module-boundary-types}
     */
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    /**
     * Enforce consistent class members order
     * @see {@link https://typescript-eslint.io/rules/member-ordering}
     */
    '@typescript-eslint/member-ordering': [
      'warn',
      {
        default: [
          'signature',
          'private-static-field',
          'private-static-method',
          'protected-static-field',
          'protected-static-method',
          'public-static-method',
          'public-static-field',
          'private-decorated-field',
          'private-instance-field',
          'private-decorated-method',
          'private-instance-method',
          'protected-decorated-field',
          'protected-instance-field',
          'protected-abstract-field',
          'public-decorated-field',
          'public-instance-field',
          'public-abstract-field',
          'protected-decorated-method',
          'protected-instance-method',
          'protected-abstract-method',
          'public-decorated-method',
          'public-instance-method',
          'public-abstract-method',
          'public-constructor',
          'protected-constructor',
          'private-constructor',
        ],
      },
    ],
    /**
     * Enforce consistent method types declarations in interfaces
     * @see {@link https://typescript-eslint.io/rules/method-signature-style}
     */
    '@typescript-eslint/method-signature-style': 'error',
    /**
     * Enforce consistent naming
     * TODO: Add rules for naming conventions
     * TODO: Make this rule an error
     * @see {@link https://typescript-eslint.io/rules/naming-convention}
     */
    '@typescript-eslint/naming-convention': 'off',
    /**
     * Enforce explicit conversion of complex structures to string
     * TODO: Make this rule an error
     * @see {@link https://typescript-eslint.io/rules/no-base-to-string}
     */
    '@typescript-eslint/no-base-to-string': 'off',
    /**
     * Prohibit confusing non-null assertions like a! == null(may be confused with a !== null)
     * @see {@link https://typescript-eslint.io/rules/no-confusing-non-null}
     */
    '@typescript-eslint/no-confusing-non-null-assertion': 'error',
    /**
     * Prevent from using void values in expressions
     * @see {@link https://typescript-eslint.io/rules/no-confusing-void-expression}
     */
    '@typescript-eslint/no-confusing-void-expression': [
      'error',
      { ignoreArrowShorthand: true, ignoreVoidOperator: true },
    ],
    /**
     * Disallow duplicate enum values
     * @see {@link https://typescript-eslint.io/rules/no-duplicate-enum-values}
     */
    '@typescript-eslint/no-duplicate-enum-values': 'error',
    /**
     * Disallow duplicates on union and intersection types
     * TODO: Decide if this rule should be enabled or disabled
     * @see {@link https://typescript-eslint.io/rules/no-duplicate-type-constituents}
     */
    '@typescript-eslint/no-duplicate-type-constituents': 'off',
    /**
     * Disallow usage of a delete operator on computed key expressions
     * @see {@link https://typescript-eslint.io/rules/no-dynamic-delete}
     */
    '@typescript-eslint/no-dynamic-delete': 'error',
    /**
     * Disallow empty interfaces which does not extend from any other interface
     * @override Overrides rule from typescript-eslint/eslint-recommended
     * @see {@link https://typescript-eslint.io/rules/no-empty-interface}
     */
    '@typescript-eslint/no-empty-interface': ['error', { allowSingleExtends: true }],
    /**
     * Disallow empty classes
     * @see {@link https://typescript-eslint.io/rules/no-extraneous-class}
     */
    '@typescript-eslint/no-extraneous-class': 'error',
    /**
     * Enforce promise handling
     * @see {@link https://typescript-eslint.io/rules/no-floating-promises}
     */
    '@typescript-eslint/no-floating-promises': [
      'error',
      {
        ignoreVoid: true,
      },
    ],
    /**
     * Disallow iterating over an array with a for-in loop
     * @see {@link https://typescript-eslint.io/rules/no-for-in-array}
     */
    '@typescript-eslint/no-for-in-array': 'error',
    /**
     * Enforce top-level import type qualifier for type-only import statements
     * @see {@link https://typescript-eslint.io/rules/no-import-type-side-effects}
     */
    '@typescript-eslint/no-import-type-side-effects': 'error',
    /**
     * Disallow void type declarations for non-return types
     * @see {@link https://typescript-eslint.io/rules/no-invalid-void-type}
     */
    '@typescript-eslint/no-invalid-void-type': 'error',
    /**
     * Disallow use of void operator where it does not make sense
     * @see {@link https://typescript-eslint.io/rules/no-misused-void-operator}
     */
    '@typescript-eslint/no-meaningless-void-operator': 'error',
    /**
     * Disallow direct usage of Promise where it does not make sense
     * @see {@link https://typescript-eslint.io/rules/no-misused-promises}
     */
    '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
    /**
     * Disallow mixing string and number as enum values
     * @see {@link https://typescript-eslint.io/rules/no-mixed-enums}
     */
    '@typescript-eslint/no-mixed-enums': 'error',
    /**
     * Disallow non-null assertion in nullish coalescing operator
     * @see {@link https://typescript-eslint.io/rules/no-non-null-asserted-nullish-coalescing}
     */
    '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
    /**
     * Disallow redundant type assertions
     * @see {@link https://typescript-eslint.io/rules/no-redundant-type-assertion}
     */
    '@typescript-eslint/no-redundant-type-constituents': 'error',
    /**
     * Allow use of require imports
     * @see {@link https://typescript-eslint.io/rules/no-require-imports}
     */
    '@typescript-eslint/no-require-imports': 'off',
    /**
     * Enforce consistent boolean variables equality checking
     * @see {@link https://typescript-eslint.io/rules/no-unnecessary-boolean-literal-compare}
     */
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
    /**
     * Disallow unnecessary namespace qualifiers
     * @see {@link https://typescript-eslint.io/rules/no-unnecessary-qualifier}
     */
    '@typescript-eslint/no-unnecessary-qualifier': 'error',
    /**
     * Disable removing of type arguments equal to default
     * @see {@link https://typescript-eslint.io/rules/no-unnecessary-type-arguments}
     */
    '@typescript-eslint/no-unnecessary-type-arguments': 'off',
    /**
     * Disallow unnecessary type assertions
     * @see {@link https://typescript-eslint.io/rules/no-unnecessary-type-assertion}
     */
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    /**
     * Disallow empty exports where it does not make sense
     * @see {@link https://typescript-eslint.io/rules/no-useless-empty-export}
     */
    '@typescript-eslint/no-useless-empty-export': 'error',
    /**
     * Enforce enum values initializers
     * @see {@link https://typescript-eslint.io/rules/prefer-enum-initializers}
     */
    '@typescript-eslint/prefer-enum-initializers': 'error',
    /**
     * Enforce usage of for-of loops
     * @see {@link https://typescript-eslint.io/rules/prefer-for-of}
     */
    '@typescript-eslint/prefer-for-of': 'error',
    /**
     * Enforce usage of function types for type declarations
     * @see {@link https://typescript-eslint.io/rules/prefer-function-type}
     */
    '@typescript-eslint/prefer-function-type': 'error',
    /**
     * Prefer includes over indexOf
     * @see {@link https://typescript-eslint.io/rules/prefer-includes}
     */
    '@typescript-eslint/prefer-includes': 'error',
    /**
     * Enforce usage of nullish coalescing operator
     * TODO: Decide if this rule should be enabled or disabled
     * @see {@link https://typescript-eslint.io/rules/prefer-nullish-coalescing}
     */
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    /**
     * Enforce usage of optional chaining
     * @see {@link https://typescript-eslint.io/rules/prefer-optional-chain}
     */
    '@typescript-eslint/prefer-optional-chain': 'warn',
    /**
     * Enforce readonly for private class members with no mutation inside class
     * @see {@link https://typescript-eslint.io/rules/prefer-readonly}
     */
    '@typescript-eslint/prefer-readonly': 'error',
    /**
     * Enforce reduce method type declaration using generic
     * @see {@link https://typescript-eslint.io/rules/prefer-reduce-type-parameter}
     */
    '@typescript-eslint/prefer-reduce-type-parameter': 'error',
    /**
     * Enforce usage of RegExp#exec over String#match
     * @see {@link https://typescript-eslint.io/rules/prefer-regexp-exec}
     */
    '@typescript-eslint/prefer-regexp-exec': 'warn',
    /**
     * Use `this` for type declaration of class method when it returns only `this` type
     * @see {@link https://typescript-eslint.io/rules/prefer-return-this-type}
     */
    '@typescript-eslint/prefer-return-this-type': 'error',
    /**
     * Enforce usage of String#startsWith and String#endsWith
     * @see {@link https://typescript-eslint.io/rules/prefer-string-starts-ends-with}
     */
    '@typescript-eslint/prefer-string-starts-ends-with': 'error',
    /**
     * Enforce marking any function returning Promise as async
     * @see {@link https://typescript-eslint.io/rules/promise-function-async}
     */
    '@typescript-eslint/promise-function-async': 'error',
    /**
     * Enforce providing of compareFunction to Array#sort method if it is not an array of strings
     * @see {@link https://typescript-eslint.io/rules/require-array-sort-compare}
     */
    '@typescript-eslint/require-array-sort-compare': ['error', { ignoreStringArrays: true }],
    /**
     * Restrict usage of plus operands when types are different or not primitive
     * @see {@link https://typescript-eslint.io/rules/restrict-plus-operands}
     */
    '@typescript-eslint/restrict-plus-operands': 'error',
    /**
     * Enforce switch-case to be exhaustive
     * @see {@link https://typescript-eslint.io/rules/switch-exhaustiveness-check}
     */
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    /**
     * Enforce default and optional parameters to be last
     *
     * Default param list rule from ESLint must be turned off
     * @see {@link https://typescript-eslint.io/rules/default-param-last}
     */
    '@typescript-eslint/default-param-last': 'error',
    'default-param-last': 'off',
    /**
     * Disallow empty functions
     * @override Overrides rule from typescript-eslint/eslint-recommended
     * @see {@link https://typescript-eslint.io/rules/no-empty-function}
     */
    '@typescript-eslint/no-empty-function': [
      'error',
      {
        allow: ['private-constructors', 'protected-constructors', 'overrideMethods'],
      },
    ],
    /**
     * Enforce to throw only Error
     *
     * Default rule from ESLint must be turned off
     * @see {@link https://typescript-eslint.io/rules/no-throw-literal}
     */
    '@typescript-eslint/no-throw-literal': 'error',
    'no-throw-literal': 'off',
    /**
     * Disallow unused expressions
     *
     * Default rule from ESLint must be turned off
     * @see {@link https://typescript-eslint.io/rules/no-unused-expressions}
     */
    '@typescript-eslint/no-unused-expressions': 'error',
    'no-unused-expressions': 'off',
    /**
     * Allow using type, interface and enum declarations before they are defined
     * @see {@link https://typescript-eslint.io/rules/no-use-before-define}
     */
    '@typescript-eslint/no-use-before-define': 'off',
    /**
     * Disallow unnecessary constructors
     *
     * Default rule from ESLint must be turned off
     * @see {@link https://typescript-eslint.io/rules/no-useless-constructor}
     */
    '@typescript-eslint/no-useless-constructor': 'error',
    'no-useless-constructor': 'off',
    /**
     * Disallow unused variables in code
     *
     * Default rule from ESLint must be turned off
     * @see {@link https://typescript-eslint.io/rules/no-unused-vars}
     */
    '@typescript-eslint/no-unused-vars': [
      'error',
      { ignoreRestSiblings: true, argsIgnorePattern: '^_', args: 'none' },
    ],
    'no-unused-vars': 'off',
  },
}

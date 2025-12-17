import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

export const typescriptConfig = defineConfig([
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    // ESLint rules handled by TypeScript itself
    rules: {
      'no-dupe-args': 'off',
      'no-dupe-class-members': 'off',
      'no-dupe-keys': 'off',
      'no-func-assign': 'off',
      'no-import-assign': 'off',
      'no-new-native-nonconstructor': 'off',
      'no-obj-calls': 'off',
      'no-setter-return': 'off',
      'no-this-before-super': 'off',
      'no-undef': 'off',
      'no-unreachable': 'off',
      'no-unsafe-negation': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    plugins: { '@typescript-eslint': tseslint.plugin },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { projectService: true },
    },
    rules: {
      // https://typescript-eslint.io/rules/adjacent-overload-signatures/
      '@typescript-eslint/adjacent-overload-signatures': 'error',

      // https://typescript-eslint.io/rules/array-type/
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],

      // https://typescript-eslint.io/rules/ban-ts-comment
      '@typescript-eslint/ban-ts-comment': [
        'error',
        { 'ts-expect-error': 'allow-with-description' },
      ],

      // https://typescript-eslint.io/rules/ban-tslint-comment/
      '@typescript-eslint/ban-tslint-comment': 'error',

      // https://typescript-eslint.io/rules/class-literal-property-style/
      '@typescript-eslint/class-literal-property-style': ['error', 'fields'],

      // https://typescript-eslint.io/rules/class-methods-use-this/
      'class-methods-use-this': 'off',
      '@typescript-eslint/class-methods-use-this': 'warn',

      // https://typescript-eslint.io/rules/consistent-generic-constructors/
      '@typescript-eslint/consistent-generic-constructors': [
        'error',
        'constructor',
      ],

      // https://typescript-eslint.io/rules/consistent-indexed-object-style/
      '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],

      // https://typescript-eslint.io/rules/consistent-type-assertions/
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'as',
          arrayLiteralTypeAssertions: 'allow',
          objectLiteralTypeAssertions: 'allow',
        },
      ],

      // https://typescript-eslint.io/rules/consistent-type-definitions/
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],

      // https://typescript-eslint.io/rules/consistent-type-imports/
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          disallowTypeAnnotations: true,
          fixStyle: 'inline-type-imports',
          prefer: 'type-imports',
        },
      ],

      // https://typescript-eslint.io/rules/default-param-last/
      'default-param-last': 'off',
      '@typescript-eslint/default-param-last': 'error',

      // https://typescript-eslint.io/rules/explicit-function-return-type/
      '@typescript-eslint/explicit-function-return-type': 'off',

      // https://typescript-eslint.io/rules/explicit-member-accessibility/
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { accessibility: 'no-public' },
      ],

      // https://typescript-eslint.io/rules/explicit-module-boundary-types/
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // https://typescript-eslint.io/rules/init-declarations/
      'init-declarations': 'off',
      '@typescript-eslint/init-declarations': ['off', 'always'],

      // https://typescript-eslint.io/rules/max-params/
      'max-params': 'off',
      '@typescript-eslint/max-params': ['warn', { max: 5 }],

      // https://typescript-eslint.io/rules/member-ordering/
      '@typescript-eslint/member-ordering': 'off',

      // https://typescript-eslint.io/rules/method-signature-style/
      '@typescript-eslint/method-signature-style': ['error', 'property'],

      // https://typescript-eslint.io/rules/no-array-constructor/
      'no-array-constructor': 'off',
      '@typescript-eslint/no-array-constructor': 'error',

      // https://typescript-eslint.io/rules/no-confusing-non-null-assertion/
      '@typescript-eslint/no-confusing-non-null-assertion': 'error',

      // https://typescript-eslint.io/rules/no-deprecated/
      '@typescript-eslint/no-deprecated': 'warn',

      // https://typescript-eslint.io/rules/no-dupe-class-members/
      'no-dupe-class-members': 'off',
      '@typescript-eslint/no-dupe-class-members': 'off',

      // https://typescript-eslint.io/rules/no-duplicate-enum-values/
      '@typescript-eslint/no-duplicate-enum-values': 'error',

      // https://typescript-eslint.io/rules/no-dynamic-delete/
      '@typescript-eslint/no-dynamic-delete': 'error',

      // https://typescript-eslint.io/rules/no-empty-function/
      'no-empty-function': 'off',
      '@typescript-eslint/no-empty-function': 'error',

      // https://typescript-eslint.io/rules/no-empty-interface/
      '@typescript-eslint/no-empty-interface': 'off',

      // https://typescript-eslint.io/rules/no-empty-object-type/
      '@typescript-eslint/no-empty-object-type': [
        'error',
        { allowInterfaces: 'with-single-extends', allowObjectTypes: 'never' },
      ],

      // https://typescript-eslint.io/rules/no-explicit-any/
      '@typescript-eslint/no-explicit-any': [
        'error',
        { fixToUnknown: true, ignoreRestArgs: false },
      ],

      // https://typescript-eslint.io/rules/no-extra-non-null-assertion/
      '@typescript-eslint/no-extra-non-null-assertion': 'error',

      // https://typescript-eslint.io/rules/no-extraneous-class/
      '@typescript-eslint/no-extraneous-class': [
        'error',
        {
          allowConstructorOnly: false,
          allowEmpty: false,
          allowStaticOnly: false,
          allowWithDecorator: false,
        },
      ],

      // https://typescript-eslint.io/rules/no-import-type-side-effects/
      '@typescript-eslint/no-import-type-side-effects': 'error',

      // https://typescript-eslint.io/rules/no-inferrable-types/
      '@typescript-eslint/no-inferrable-types': [
        'error',
        { ignoreParameters: false, ignoreProperties: false },
      ],

      // https://typescript-eslint.io/rules/no-invalid-this/
      'no-invalid-this': 'off',
      '@typescript-eslint/no-invalid-this': 'off',

      // https://typescript-eslint.io/rules/no-invalid-void-type/
      '@typescript-eslint/no-invalid-void-type': [
        'error',
        { allowAsThisParameter: false, allowInGenericTypeArguments: true },
      ],

      // https://typescript-eslint.io/rules/no-loop-func/
      'no-loop-func': 'off',
      '@typescript-eslint/no-loop-func': 'error',

      // https://typescript-eslint.io/rules/no-loss-of-precision/
      '@typescript-eslint/no-loss-of-precision': 'off',

      // https://typescript-eslint.io/rules/no-magic-numbers/
      'no-magic-numbers': 'off',
      '@typescript-eslint/no-magic-numbers': [
        'off',
        {
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
          ignoreReadonlyClassProperties: true,
          ignoreTypeIndexes: true,
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          ignoreClassFieldInitialValues: true,
          enforceConst: true,
          detectObjects: false,
        },
      ],

      // https://typescript-eslint.io/rules/no-misused-new/
      '@typescript-eslint/no-misused-new': 'error',

      // https://typescript-eslint.io/rules/no-namespace/
      '@typescript-eslint/no-namespace': 'error',

      // https://typescript-eslint.io/rules/no-non-null-asserted-nullish-coalescing/
      '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',

      // https://typescript-eslint.io/rules/no-non-null-asserted-optional-chain/
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',

      // https://typescript-eslint.io/rules/no-non-null-assertion/
      '@typescript-eslint/no-non-null-assertion': 'error',

      // https://typescript-eslint.io/rules/no-redeclare/
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'off',

      // https://typescript-eslint.io/rules/no-require-imports/
      '@typescript-eslint/no-require-imports': [
        'error',
        {
          allowAsImport: false,
          allow: ['.*\\.png$', '.*\\.jpg$', '.*\\.jpeg$'],
        },
      ],

      // https://typescript-eslint.io/rules/no-restricted-imports/
      'no-restricted-imports': 'off',
      '@typescript-eslint/no-restricted-imports': 'error',

      // https://typescript-eslint.io/rules/no-shadow/
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': [
        'off',
        {
          builtinGlobals: true,
          hoist: 'all',
          ignoreTypeValueShadow: false,
          ignoreFunctionTypeParameterNameValueShadow: false,
        },
      ],

      // https://typescript-eslint.io/rules/no-this-alias/
      '@typescript-eslint/no-this-alias': [
        'error',
        { allowDestructuring: true },
      ],

      // https://typescript-eslint.io/rules/no-type-alias/
      '@typescript-eslint/no-type-alias': 'off',

      // https://typescript-eslint.io/rules/no-unnecessary-parameter-property-assignment/
      '@typescript-eslint/no-unnecessary-parameter-property-assignment':
        'error',

      // https://typescript-eslint.io/rules/no-unnecessary-type-constraint/
      '@typescript-eslint/no-unnecessary-type-constraint': 'error',

      // https://typescript-eslint.io/rules/no-unsafe-declaration-merging/
      '@typescript-eslint/no-unsafe-declaration-merging': 'error',

      // https://typescript-eslint.io/rules/no-unsafe-function-type/
      '@typescript-eslint/no-unsafe-function-type': 'error',

      // https://typescript-eslint.io/rules/no-unused-expressions/
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: false,
          allowTernary: false,
          allowTaggedTemplates: false,
          enforceForJSX: true,
        },
      ],

      // https://typescript-eslint.io/rules/no-unused-vars/
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          ignoreClassWithStaticInitBlock: false,
        },
      ],

      // https://typescript-eslint.io/rules/no-use-before-define/
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': [
        'off',
        {
          enums: true,
          typedefs: true,
          ignoreTypeReferences: true,
          functions: true,
          classes: true,
          variables: true,
          allowNamedExports: false,
        },
      ],

      // https://typescript-eslint.io/rules/no-useless-constructor/
      'no-useless-constructor': 'off',
      '@typescript-eslint/no-useless-constructor': 'error',

      // https://typescript-eslint.io/rules/no-useless-empty-export/
      '@typescript-eslint/no-useless-empty-export': 'error',

      // https://typescript-eslint.io/rules/no-var-requires/
      '@typescript-eslint/no-var-requires': 'off',

      // https://typescript-eslint.io/rules/no-wrapper-object-types/
      '@typescript-eslint/no-wrapper-object-types': 'error',

      // https://typescript-eslint.io/rules/parameter-properties/
      '@typescript-eslint/parameter-properties': [
        'error',
        {
          allow: [
            'private',
            'protected',
            'public',
            'private readonly',
            'protected readonly',
            'public readonly',
            'readonly',
          ],
          prefer: 'parameter-property',
        },
      ],

      // https://typescript-eslint.io/rules/prefer-as-const/
      '@typescript-eslint/prefer-as-const': 'error',

      // https://typescript-eslint.io/rules/prefer-enum-initializers/
      '@typescript-eslint/prefer-enum-initializers': 'warn',

      // https://typescript-eslint.io/rules/prefer-for-of/
      '@typescript-eslint/prefer-for-of': 'warn',

      // https://typescript-eslint.io/rules/prefer-function-type/
      '@typescript-eslint/prefer-function-type': 'error',

      // https://typescript-eslint.io/rules/prefer-literal-enum-member/
      '@typescript-eslint/prefer-literal-enum-member': [
        'error',
        { allowBitwiseExpressions: false },
      ],

      // https://typescript-eslint.io/rules/prefer-namespace-keyword/
      '@typescript-eslint/prefer-namespace-keyword': 'off',

      // https://typescript-eslint.io/rules/prefer-ts-expect-error/
      '@typescript-eslint/prefer-ts-expect-error': 'error',

      // https://typescript-eslint.io/rules/sort-type-constituents/
      '@typescript-eslint/sort-type-constituents': 'off',

      // https://typescript-eslint.io/rules/triple-slash-reference/
      '@typescript-eslint/triple-slash-reference': [
        'error',
        { lib: 'never', path: 'never', types: 'prefer-import' },
      ],

      // https://typescript-eslint.io/rules/typedef/
      '@typescript-eslint/typedef': 'off',

      // https://typescript-eslint.io/rules/unified-signatures/
      '@typescript-eslint/unified-signatures': [
        'error',
        {
          ignoreDifferentlyNamedParameters: true,
          ignoreOverloadsWithDifferentJSDoc: true,
        },
      ],
    },
  },
  {
    files: ['**/*.test.{ts,tsx,mts,cts}', '**/*.spec.{ts,tsx,mts,cts}'],
    plugins: { '@typescript-eslint': tseslint.plugin },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { projectService: true },
    },
    rules: {
      // https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/unbound-method.md
      '@typescript-eslint/unbound-method': 'off',
    },
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
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
    },
  },
])

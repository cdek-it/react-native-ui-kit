import { defineConfig } from 'eslint/config'
import react from 'eslint-plugin-react'

import * as reactHooks from 'eslint-plugin-react-hooks'

export const reactConfig = defineConfig([
  {
    files: ['**/*.{js,jsx,cjs,mjs,ts,tsx,mts,cts}'],
    plugins: { react },
    settings: { react: { version: 'detect' } },
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
    rules: {
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/boolean-prop-naming.md
      'react/boolean-prop-naming': [
        'error',
        {
          validateNested: true,
          rule: '(^(is|has|with|show)[A-Z]([A-Za-z0-9]?)+)|disabled|loading|paragraph|base|controlled',
        },
      ],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/button-has-type.md
      'react/button-has-type': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/checked-requires-onchange-or-readonly.md
      'react/checked-requires-onchange-or-readonly': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/default-props-match-prop-types.md
      'react/default-props-match-prop-types': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md
      'react/destructuring-assignment': ['error', 'always'],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/display-name.md
      'react/display-name': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/forbid-component-props.md
      'react/forbid-component-props': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/forbid-dom-props.md
      'react/forbid-dom-props': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/forbid-elements.md
      'react/forbid-elements': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/forbid-foreign-prop-types.md
      'react/forbid-foreign-prop-types': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/forbid-prop-types.md
      'react/forbid-prop-types': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/forward-ref-uses-ref.md
      'react/forward-ref-uses-ref': 'warn',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/function-component-definition.md
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/hook-use-state.md
      'react/hook-use-state': ['error', { allowDestructuredState: false }],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/iframe-missing-sandbox.md
      'react/iframe-missing-sandbox': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-boolean-value.md
      'react/jsx-boolean-value': ['error', 'never'],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-child-element-spacing.md
      'react/jsx-child-element-spacing': 'off', // Rule conflicting with prettier

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-closing-bracket-location.md
      'react/jsx-closing-bracket-location': [
        'off', // Rule conflicting with prettier
        { nonEmpty: 'line-aligned', selfClosing: 'line-aligned' },
      ],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-closing-tag-location.md
      'react/jsx-closing-tag-location': ['off', 'line-aligned'], // Rule conflicting with prettier

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-curly-brace-presence.md
      'react/jsx-curly-brace-presence': ['error', 'never'],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-curly-newline.md
      'react/jsx-curly-newline': [
        'off', // Rule conflicting with prettier
        { multiline: 'forbid', singleline: 'forbid' },
      ],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-curly-spacing.md
      'react/jsx-curly-spacing': ['off', 'never'], // Rule conflicting with prettier

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-equals-spacing.md
      'react/jsx-equals-spacing': ['off', 'never'], // Rule conflicting with prettier

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md
      'react/jsx-filename-extension': [
        'error',
        {
          allow: 'as-needed',
          extensions: ['.jsx', '.tsx'],
          ignoreFilesWithoutCode: true,
        },
      ],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-first-prop-new-line.md
      'react/jsx-first-prop-new-line': ['off', 'multiline'], // Rule conflicting with prettier

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-fragments.md
      'react/jsx-fragments': ['error', 'syntax'],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-handler-names.md
      'react/jsx-handler-names': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-indent.md
      'react/jsx-indent': ['off', 2], // Rule conflicting with prettier

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-indent-props.md
      'react/jsx-indent-props': ['off', 2], // Rule conflicting with prettier

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-key.md
      'react/jsx-key': ['error', { warnOnDuplicates: true }],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-max-depth.md
      'react/jsx-max-depth': ['warn', { max: 20 }],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-max-props-per-line.md
      'react/jsx-max-props-per-line': [
        'off', // Rule conflicting with prettier
        { maximum: 1, when: 'multiline' },
      ],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-newline.md
      'react/jsx-newline': 'off', // Rule conflicting with prettier

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md
      'react/jsx-no-bind': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-comment-textnodes.md
      'react/jsx-no-comment-textnodes': 'error',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-constructed-context-values.md
      'react/jsx-no-constructed-context-values': 'error',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-duplicate-props.md
      'react/jsx-no-duplicate-props': 'error',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-leaked-render.md
      'react/jsx-no-leaked-render': 'error',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-literals.md
      'react/jsx-no-literals': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-script-url.md
      'react/jsx-no-script-url': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-target-blank.md
      'react/jsx-no-target-blank': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-undef.md
      'react/jsx-no-undef': 'error',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-useless-fragment.md
      'react/jsx-no-useless-fragment': 'error',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-one-expression-per-line.md
      'react/jsx-one-expression-per-line': ['off', { allow: 'non-jsx' }], // Rule conflicting with prettier

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-pascal-case.md
      'react/jsx-pascal-case': 'error',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-props-no-multi-spaces.md
      'react/jsx-props-no-multi-spaces': 'off', // Rule conflicting with prettier

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-props-no-spread-multi.md
      'react/jsx-props-no-spread-multi': 'error',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-props-no-spreading.md
      'react/jsx-props-no-spreading': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-sort-default-props.md
      'react/jsx-sort-default-props': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-sort-props.md
      'react/jsx-sort-props': [
        'error',
        { shorthandFirst: true, callbacksLast: true },
      ],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-space-before-closing.md
      'react/jsx-space-before-closing': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-tag-spacing.md
      'react/jsx-tag-spacing': [
        'off', // Rule conflicting with prettier
        {
          closingSlash: 'never',
          beforeSelfClosing: 'always',
          afterOpening: 'never',
          beforeClosing: 'never',
        },
      ],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-uses-react.md
      'react/jsx-uses-react': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-uses-vars.md
      'react/jsx-uses-vars': 'error',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-wrap-multilines.md
      'react/jsx-wrap-multilines': [
        'off', // Rule conflicting with prettier
        {
          declaration: 'parens-new-line',
          assignment: 'parens-new-line',
          return: 'parens-new-line',
          arrow: 'parens-new-line',
          condition: 'parens-new-line',
          logical: 'parens-new-line',
          prop: 'parens-new-line',
        },
      ],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-access-state-in-setstate.md
      'react/no-access-state-in-setstate': 'error',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-adjacent-inline-elements.md
      'react/no-adjacent-inline-elements': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-adjacent-inline-elements.md
      'react/no-array-index-key': 'error',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-arrow-function-lifecycle.md
      'react/no-arrow-function-lifecycle': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-children-prop.md
      'react/no-children-prop': 'error',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-danger.md
      'react/no-danger': 'error',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-danger-with-children.md
      'react/no-danger-with-children': 'error',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-deprecated.md
      'react/no-deprecated': 'warn',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-did-mount-set-state.md
      'react/no-did-mount-set-state': ['error', 'disallow-in-func'],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-did-update-set-state.md
      'react/no-did-update-set-state': ['error', 'disallow-in-func'],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-direct-mutation-state.md
      'react/no-direct-mutation-state': 'error',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-find-dom-node.md
      'react/no-find-dom-node': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-invalid-html-attribute.md
      'react/no-invalid-html-attribute': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-is-mounted.md
      'react/no-is-mounted': 'error',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-multi-comp.md
      'react/no-multi-comp': ['error', { ignoreStateless: true }],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-namespace.md
      'react/no-namespace': 'error',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-object-type-as-default-prop.md
      'react/no-object-type-as-default-prop': 'error',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-redundant-should-component-update.md
      'react/no-redundant-should-component-update': 'error',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-render-return-value.md
      'react/no-render-return-value': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-set-state.md
      'react/no-set-state': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-string-refs.md
      'react/no-string-refs': 'error',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-this-in-sfc.md
      'react/no-this-in-sfc': 'error',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-typos.md
      'react/no-typos': 'error',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unescaped-entities.md
      'react/no-unescaped-entities': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unknown-property.md
      'react/no-unknown-property': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unsafe.md
      'react/no-unsafe': ['off', { checkAliases: true }],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unstable-nested-components.md
      'react/no-unstable-nested-components': ['warn', { allowAsProps: false }],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unused-class-component-methods.md
      'react/no-unused-class-component-methods': 'error',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unused-prop-types.md
      'react/no-unused-prop-types': 'error',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unused-state.md
      'react/no-unused-state': 'error',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-will-update-set-state.md
      'react/no-will-update-set-state': ['error', 'disallow-in-func'],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/prefer-es6-class.md
      'react/prefer-es6-class': ['error', 'always'],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/prefer-exact-props.md
      'react/prefer-exact-props': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/prefer-read-only-props.md
      'react/prefer-read-only-props': 'error',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/prefer-stateless-function.md
      'react/prefer-stateless-function': 'error',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/prop-types.md
      'react/prop-types': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/react-in-jsx-scope.md
      'react/react-in-jsx-scope': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/require-default-props.md
      'react/require-default-props': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/require-optimization.md
      'react/require-optimization': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/require-render-return.md
      'react/require-render-return': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/self-closing-comp.md
      'react/self-closing-comp': ['error', { component: true, html: true }],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/sort-comp.md
      'react/sort-comp': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/sort-default-props.md
      'react/sort-default-props': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/sort-prop-types.md
      'react/sort-prop-types': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/state-in-constructor.md
      'react/state-in-constructor': ['error', 'always'],

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/static-property-placement.md
      'react/static-property-placement': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/style-prop-object.md
      'react/style-prop-object': 'off',

      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/void-dom-elements-no-children.md
      'react/void-dom-elements-no-children': 'error',
    },
  },
  {
    files: ['**/*.{js,jsx,cjs,mjs,ts,tsx,mts,cts}'],
    // @ts-expect-error Типизация Plugin React Hooks не совпадает с типизацией которую ожидает ESLint
    plugins: { 'react-hooks': reactHooks },
    rules: {
      // https://react.dev/reference/rules/rules-of-hooks
      'react-hooks/rules-of-hooks': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    files: ['**/*.stories.{js,jsx,cjs,mjs,ts,tsx,mts,cts}'],
    rules: { 'react-hooks/rules-of-hooks': 'off' },
  },
])

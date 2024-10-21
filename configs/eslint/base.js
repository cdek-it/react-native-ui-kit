/**
 * ESLint rules
 * @see {@link https://eslint.org/docs/rules/}
 */
module.exports = {
  extends: ['eslint:recommended'],
  rules: {
    /**
     * Disallow duplicate module imports
     * @see {@link https://eslint.org/docs/rules/no-duplicate-imports}
     */
    'no-duplicate-imports': 'error',
    /**
     * Disallow comparisons of the value with itself
     * @see {@link https://eslint.org/docs/rules/no-self-compare}
     */
    'no-self-compare': 'error',
    /**
     * Enforce to only template strings only with two backtick quotes(\`)
     * @see {@link https://eslint.org/docs/rules/no-template-curly-in-string}
     */
    'no-template-curly-in-string': 'error',
    /**
     * Disallow assignments that can lead to race conditions
     * @see {@link https://eslint.org/docs/rules/require-atomic-updates}
     */
    'require-atomic-updates': 'error',
    /**
     * Enforce braces around arrow function bodies only when needed
     * @see {@link https://eslint.org/docs/rules/arrow-body-style}
     */
    'arrow-body-style': ['error', 'as-needed'],
    /**
     * Enforce block scoped usage of variables to avoid bugs with variable hoisting
     * @see {@link https://eslint.org/docs/rules/block-scoped-var}
     */
    'block-scoped-var': 'error',
    /**
     * Limit cyclomatic complexity to maximum of 10
     * TODO: Make this rule an error
     * @see {@link https://eslint.org/docs/rules/complexity}
     */
    complexity: ['warn', 10],
    /**
     * Limit maximum depth that blocks can be nested to 4 to reduce code complexity
     * TODO: Make this rule an error
     * @see {@link https://eslint.org/docs/rules/max-depth}
     */
    'max-depth': ['warn', 5],
    /**
     * Limit the number of lines which function consists of to reduce code complexity
     * TODO: Make this rule an error
     * TODO:: Reduce number of lines
     * @see {@link https://eslint.org/docs/rules/max-lines-per-function}
     */
    'max-lines-per-function': [
      'warn',
      { max: 200, skipBlankLines: true, skipComments: true, IIFEs: true },
    ],
    /**
     * Limit the number of nested callbacks to 4 to reduce code complexity and increase code readability
     * TODO: Make this rule an error
     * @see {@link https://eslint.org/docs/rules/max-nested-callbacks}
     */
    'max-nested-callbacks': ['warn', 4],
    /**
     * Limit number of parameters that can be used in the function declaration to 5 to reduce code complexity
     * TODO: Make this rule an error
     * @see {@link https://eslint.org/docs/rules/max-params}
     */
    'max-params': ['warn', 10],
    /**
     * Limit the number of statements allowed in a function to 10 to reduce code complexity
     * TODO: Make this rule an error
     * @see {@link https://eslint.org/docs/rules/max-statements}
     */
    'max-statements': ['warn', 20],
    /**
     * Limit the number of lines per file to 400 to reduce code complexity
     * TODO: Make this rule an error
     * TODO: Reduce number of lines
     * @see {@link https://eslint.org/docs/rules/max-lines}
     */
    'max-lines': ['warn', { max: 500, skipBlankLines: true, skipComments: true }],
    /**
     * Enforce maximum number of classes per file to 1
     * TODO: Make this rule an error
     * @see {@link https://eslint.org/docs/rules/max-classes-per-file}
     */
    'max-classes-per-file': ['warn', 1],
    /**
     * Enforce curly braces for all control statements
     * @see {@link https://eslint.org/docs/rules/curly}
     */
    curly: 'error',
    /**
     * Enforce default case to be last in switch statements
     * @see {@link https://eslint.org/docs/rules/default-case-last}
     */
    'default-case-last': 'error',
    /**
     * Enforce type-safe equality operators
     * @see {@link https://eslint.org/docs/rules/eqeqeq}
     */
    eqeqeq: ['error', 'smart'],
    /**
     * Enforce getters and setters to always be adjacent and setter follow getter
     * @see {@link https://eslint.org/docs/rules/grouped-accessor-pairs}
     */
    'grouped-accessor-pairs': ['error', 'getBeforeSet'],
    /**
     * Disallow usage of console statements in code
     * @see {@link https://eslint.org/docs/rules/no-console}
     */
    'no-console': 'warn',
    /**
     * Enforce if-else-if over only one if inside else clause
     * @see {@link https://eslint.org/docs/rules/no-lonely-if}
     */
    'no-lonely-if': 'error',
    /**
     * Disallow usage of var keyword.
     * Use let or const instead.
     * @see {@link https://eslint.org/docs/rules/no-var}
     */
    'no-var': 'error',
    /**
     * Enforce usage of const declaration for variables that are never reassigned after declared
     * @see {@link https://eslint.org/docs/rules/prefer-const}
     */
    'prefer-const': 'error',
    /**
     * Enforce the use of rest parameters instead of arguments
     * @see {@link https://eslint.org/docs/rules/prefer-rest-params}
     */
    'prefer-rest-params': 'error',
    /**
     * Enforce the use of template literals instead of string concatenation
     * @see {@link https://eslint.org/docs/rules/prefer-template}
     */
    'prefer-template': 'error',
    /**
     * Enforce spacing in comments
     * @see {@link https://eslint.org/docs/rules/spaced-comment}
     */
    'spaced-comment': ['error', 'always'],
    /**
     * Disallow Master Yoda style conditions
     * @see {@link https://eslint.org/docs/rules/yoda}
     */
    yoda: ['error', 'never'],
    /**
     * Disable rule preventing from using magic numbers in code
     * TODO: Decide if this rule should be enabled or disabled
     * @see {@link https://eslint.org/docs/rules/no-magic-numbers}
     */
    'no-magic-numbers': 'off',
  },
}

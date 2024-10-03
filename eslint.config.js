import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  ...svelte.configs['flat/recommended'],
  prettier,
  ...svelte.configs['flat/prettier'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    ignores: ['build/', '.svelte-kit/', 'dist/'],
  },
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      indent: ['error', 2], // enforce consistent indentation
      quotes: ['error', 'single'],
      semi: 'warn', // semicolon
      complexity: 'warn', // Limit Cyclomatic Complexity
      curly: 'warn', // Enforce Usage of Spacing in Template Strings
      'svelte/valid-compile': 'off',
      jsxDoubleQuote: 'off',
      'a11y/missing-content': 'off',
      'space-before-blocks': 'error',
      'jsx-quotes': 'off',
      'no-multi-spaces': ['error', { ignoreEOLComments: false }], // Disallow multiple spaces
      'comma-spacing': ['error', { before: false, after: true }], // Enforce consistent spacing before and after commas
      'arrow-spacing': ['warn', { before: true, after: true }], // Enforce consistent spacing before and after the arrow in arrow functions
      'computed-property-spacing': 'warn', // Enforce consistent spacing inside computed property brackets
      'array-bracket-spacing': 'warn', // Enforce consistent spacing inside array brackets
      'space-infix-ops': 'warn', // spaces between +=- etc
      'keyword-spacing': 'warn', // Enforce consistent spacing before and after keywords
      'key-spacing': ['error', { beforeColon: false }], // Enforce consistent spacing between keys and values in object literal properties
      'brace-style': 'warn', // Require Brace Style
      'default-case': 'warn', // Require Default Case in Switch Statements
      'max-classes-per-file': ['warn', 1], // enforce a maximum number of classes per file
      'no-bitwise': 'warn', // disallow bitwise operators
      'no-cond-assign': 'warn', // disallow assignment operators in conditional statements
      'no-empty': 'warn', // disallow empty block statements
      'newline-before-return': 'error', // require an empty line before
      'no-new-wrappers': 'warn', // Disallow Primitive Wrapper Instances
      'no-var': 'warn',
      'object-shorthand': 'warn', // Require Object Literal Shorthand Syntax
      'one-var': ['error', 'never'], // enforce variables to be declared either together or separately in functions
      'prefer-const': 'warn', // Suggest using const
      'quote-props': ['warn', 'as-needed'], // require quotes around object literal property names
      'spaced-comment': [
        // Requires or disallows a whitespace (space or tab) beginning a comment
        'warn',
        'always',
        {
          markers: ['/'],
        },
      ],
      'use-isnan': 'warn', // require calls to isNaN() when checking for NaN
      'max-len': ['error', { code: 140 }], // enforce a maximum line length
      'comma-dangle': ['error', 'only-multiline'], // require or disallow trailing commas
      'object-curly-spacing': ['error', 'always'], // enforce consistent spacing inside braces
      'arrow-parens': ['error', 'as-needed'], // Require parens in arrow function arguments
      'array-element-newline': [
        'error',
        {
          ArrayExpression: 'consistent',
          ArrayPattern: { minItems: 2 },
        },
      ],
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          svelte: 'never',
        },
      ],
    },
  },
];

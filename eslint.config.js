const prettier = require('eslint-plugin-prettier');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const globals = require('globals');
const angular = require('angular-eslint');
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  {
    ignores: ['dist/**', 'coverage/**', '.angular/**', '**/*.js'],
  },
  {
    plugins: {
      prettier,
      '@typescript-eslint': typescriptEslint,
    },

    languageOptions: {
      globals: {
        google: 'readonly',
      },
    },

    rules: {
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['**/*.ts'],

    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,

    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],

      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],

      '@angular-eslint/no-host-metadata-property': 'off',

      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'enumMember',
          format: ['PascalCase', 'camelCase'],
        },
      ],

      'no-shadow': 'off',
      'no-redeclare': 'off',
      'no-dupe-class-members': 'off',
      'no-control-regex': 'off',
      '@angular-eslint/component-class-suffix': 'off',
      '@angular-eslint/no-input-rename': 'off',
      '@angular-eslint/no-output-rename': 'off',
      '@typescript-eslint/no-shadow': 'error',
      'no-unused-vars': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'none',
          caughtErrors: 'none',
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      '@typescript-eslint/member-ordering': 'off',
      'linebreak-style': 'off',
      'new-cap': 'off',
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-invalid-this': 'off',
      'require-jsdoc': 'off',
      'no-empty': 'off',

      'valid-jsdoc': [
        'off',
        {
          requireParamDescription: false,
          requireReturnDescription: false,
          requireReturn: false,

          prefer: {
            returns: 'return',
          },
        },
      ],

      '@angular-eslint/prefer-on-push-component-change-detection': ['error'],
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      // ...angular.configs.templateAccessibility
    ],
    rules: {},
  },
);

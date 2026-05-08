// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
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
      // コーディング規約 (docs/coding-conventions.md) の機械的検出
      'no-restricted-syntax': [
        'error',
        // signal / computed / input / output / model / toSignal などのフィールドに `Signal` サフィックスを付けない
        {
          selector:
            'PropertyDefinition[value.type="CallExpression"][value.callee.name=/^(signal|computed|input|output|model|viewChild|viewChildren|contentChild|contentChildren|toSignal|linkedSignal)$/][key.name=/Signal$/]',
          message:
            'signal/computed 系フィールドには `Signal` サフィックスを付けないでください（docs/coding-conventions.md）。',
        },
        // input.required() / model.required() / viewChild.required() などメンバ呼び出し版
        {
          selector:
            'PropertyDefinition[value.type="CallExpression"][value.callee.type="MemberExpression"][value.callee.object.name=/^(input|model|viewChild|viewChildren|contentChild|contentChildren)$/][key.name=/Signal$/]',
          message:
            'signal/computed 系フィールドには `Signal` サフィックスを付けないでください（docs/coding-conventions.md）。',
        },
        // signal / computed 系には `$` サフィックスを付けない（`$` は Observable 用）
        {
          selector:
            'PropertyDefinition[value.type="CallExpression"][value.callee.name=/^(signal|computed|input|output|model|toSignal|linkedSignal)$/][key.name=/\\$$/]',
          message:
            '`$` サフィックスは Observable 用に予約されています。signal/computed 系には付けないでください（docs/coding-conventions.md）。',
        },
        // Subject / BehaviorSubject / ReplaySubject / AsyncSubject フィールドには末尾に `$` を付ける（Finnish Notation）
        {
          selector:
            'PropertyDefinition[value.type="NewExpression"][value.callee.name=/^(Subject|BehaviorSubject|ReplaySubject|AsyncSubject)$/]:not([key.name=/\\$$/])',
          message:
            'Subject / BehaviorSubject 等のフィールドには末尾に `$` を付けてください（Finnish Notation, docs/coding-conventions.md）。',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {},
  },
]);

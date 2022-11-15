module.exports = {
  root: true,

  env: {
    node: true,
    es2022: true
  },

  parser: '@typescript-eslint/parser',

  plugins: ['@typescript-eslint', 'import'],

  settings: {
    'import/extensions': ['.js', '.ts'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts']
    },
    'import/resolver': {
      typescript: {}
    }
  },

  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:import/recommended',
    'prettier'
  ],

  rules: {
    'no-console': 0,
    'comma-dangle': ['error', 'never'],
    'no-underscore-dangle': 0,
    'no-restricted-syntax': 0,
    'prefer-object-spread': 0,
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true }
    ],
    'no-use-before-define': ['error', { functions: false }]
  },

  overrides: [
    {
      files: ['*.ts'],

      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaVersion: 2022
      },

      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'airbnb-typescript/base',
        'plugin:import/typescript',
        'prettier'
      ],

      rules: {
        '@typescript-eslint/comma-dangle': ['error', 'never'],
        '@typescript-eslint/lines-between-class-members': 0,
        '@typescript-eslint/no-use-before-define': ['error', 'nofunc'],
        '@typescript-eslint/no-explicit-any': 0
      }
    }
  ]
};

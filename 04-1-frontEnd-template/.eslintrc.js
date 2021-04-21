module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  ignorePatterns: ['.eslintrc.js'], 
  rules: {
    'class-methods-use-this': 0,
    'import/extensions': 0,
    'no-plusplus': 0,
    'no-unused-vars': [
      'error',
      { vars: 'all', args: 'none', ignoreRestSiblings: false },
    ],
    'max-len': 0,
    'no-underscore-dangle': 'off',
    'no-param-reassign': ['error', { props: false }],
    'no-console': 'off',
  },
};

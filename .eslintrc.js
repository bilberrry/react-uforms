module.exports = {
  parser: 'babel-eslint',

  extends: [
    'airbnb',
    'plugin:react/recommended',
    'plugin:unicorn/recommended',
    'prettier',
    'prettier/react',
    'prettier/unicorn',
    'plugin:jest/recommended',
  ],

  plugins: ['react', 'prettier', 'unicorn', 'jest'],

  globals: {
    __DEV__: true,
  },

  env: {
    browser: true,
    es6: true,
    node: true,
    'jest/globals': true,
  },

  rules: {
    'import/no-extraneous-dependencies': ['error', { packageDir: '.' }],
    'no-console': [
      'error',
      {
        allow: ['warn', 'error', 'info'],
      },
    ],
    'no-underscore-dangle': [
      'error',
      {
        allow: ['__typename'],
      },
    ],
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: false,
          object: false,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],

    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
    'react/prefer-stateless-function': 'off',
    'prettier/prettier': 'error',
    camelcase: 'off',
    'unicorn/filename-case': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/label-has-for': 'off',
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    'react/no-did-update-set-state': 'off',
    'max-len': ['error', { code: 120, ignoreUrls: true }],
    'react/style-prop-object': 'off',
  },

  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src'],
      },
    },
  },
};

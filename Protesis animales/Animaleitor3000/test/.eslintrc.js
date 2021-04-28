module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2017
  },
  rules: {
    'no-console': [
      'error',
      {
        allow: ['warn', 'error']
      }
    ],
    'linebreak-style': [2, 'unix'],
    quotes: [2, 'single'],
    semi: [2, 'always']
  },
  globals: {
    CSG: true,
    CAG: true,
    echo: true,
    util: true,
    include: true,
    union: true,
    Parts: true
  }
};

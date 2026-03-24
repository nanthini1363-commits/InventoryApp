module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-native/all',
  ],
  plugins: ['react', 'react-native'],
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  env: {
    'react-native/react-native': true,
  },
  rules: {
    'react/prop-types':           'off',   // Not using TypeScript PropTypes for this project
    'react/react-in-jsx-scope':   'off',   // Not needed with React 17+
    'react-native/no-color-literals': 'off', // We use our theme object
    'react-native/sort-styles':   'off',
    'no-unused-vars':             ['warn', { argsIgnorePattern: '^_' }],
    'no-console':                 ['warn', { allow: ['warn', 'error'] }],
  },
  settings: {
    react: { version: 'detect' },
  },
};

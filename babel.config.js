// babel.config.js
export default {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          // tells Babel to target my current Node version
          node: 'current'
        },
      },
    ],
  ],
};

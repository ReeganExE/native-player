const Copy = require('copy-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    background: './src/index.js',
    redirect: './src/redirect.js',
  },
  output: {
    filename: '[name].js'
  },
  plugins: [
    new Copy([
      { from: 'src/assets/*', flatten: true },
      'src/manifest.json',
      'src/redirect.html'
    ])
  ]
};

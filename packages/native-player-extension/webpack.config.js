const Copy = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

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
  ],
  devtool: process.env.NODE_ENV === 'development' ? 'cheap-module-eval-source-map' : undefined,
  optimization: optimization()
};

function optimization() {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  return {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          ecma: 6,
          compress: { inline: false },
          output: {
            comments: false,
            beautify: false
          }
        }
      })
    ]
  };
}

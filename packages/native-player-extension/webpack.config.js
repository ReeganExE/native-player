const Copy = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


const { env } = process;
const DEV = env.NODE_ENV === 'development';

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    background: './src/index.js',
    options: './src/options.js',
    redirect: './src/redirect.js',
  },
  output: {
    filename: '[name].js'
  },
  module: {
    rules: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  plugins: [
    new Copy([
      { from: 'src/assets/*', flatten: true },
      'src/manifest.json',
      'src/options.html',
      'src/redirect.html'
    ])
  ],
  devtool: process.env.NODE_ENV === 'development' ? 'cheap-module-eval-source-map' : undefined,
  optimization: optimization()
};


function optimization() {
  const chunks = {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'vendor',
          chunks: 'all',
          minChunks: 2
        }
      }
    }
    // runtimeChunk: true
  };

  if (DEV) {
    return chunks;
  }

  return {
    ...chunks,
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          ecma: 6,
          compress: true,
          output: {
            comments: false,
            beautify: false
          }
        }
      })
    ]
  };
}

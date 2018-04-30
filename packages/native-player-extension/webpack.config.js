
module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    background: './src/index.js',
  },
  output: {
    filename: '[name].js'
  }
};

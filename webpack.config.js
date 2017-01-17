const path = require('path');

module.exports = {
  entry: {
    index: './src/react/index',
  },
  output: {
    path: path.join(__dirname, 'public/build/js'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: path.resolve(__dirname, 'node_modules/'),
        loader: 'babel-loader',
        query: {
          compact: false,
          plugins: ['transform-runtime', 'transform-decorators-legacy'],
          presets: ['es2015', 'stage-0', 'react'],
        },
      },
    ],
  },
};

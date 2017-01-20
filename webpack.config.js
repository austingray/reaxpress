const path = require('path');

module.exports = {
  entry: {
    admin: './src/react/Admin',
    index: './src/react/Index',
    login: './src/react/Login',
    register: './src/react/Register',
    account: './src/react/Account',
    page: './src/react/_global/Page',
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

const { configMode, resolve } = require('./utils');
const customConfig = require('./custom');

const config = {
  mode: configMode,
  entry: resolve('src/index.js'),
  output: {
    path: resolve('dist'),
    filename: customConfig.fileName,
    library: {
      root: customConfig.globalName.root,
      amd: customConfig.globalName.amd,
      commonjs: customConfig.globalName.commonjs,
    },
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
  module: {
    rules: [
      {
        test: /\.js(x)?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [
      '.js',
    ],
  },
};

module.exports = config;

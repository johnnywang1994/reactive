const { isProd } = require('./utils');

const pluginName = 'reactive';

module.exports = {
  globalName: {
    root: 'Reactive',
    amd: 'reactive',
    commonjs: 'reactive'
  },
  fileName: isProd ? `${pluginName}.min.js` : `${pluginName}.js`,
};

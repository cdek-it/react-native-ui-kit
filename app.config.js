const { version } = require('./package.json')

export default ({ config }) => ({
  ...config,
  version: version,
});

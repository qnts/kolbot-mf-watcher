const production = process.env.NODE_ENV === 'production';
const config = require('../' + (production ? 'server-config.json' : 'dev.server-config.json'));

module.exports = {
  production,
  config,
};

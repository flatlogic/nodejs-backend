const env = process.env.NODE_ENV || 'development';
const envConfig = require(`./db.config.${env}.js`);

module.exports = envConfig;

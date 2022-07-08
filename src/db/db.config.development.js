module.exports = {
  username: 'postgres',
  dialect: 'postgres',
  password: '',
  database: 'development',
  host: process.env.DEV_DB_HOST || 'localhost',
  logging: console.log,
};

module.exports = {
  development: {
    "username": "admin",
    "password": "admin_pass",
    "database": "sing_app_db",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  production: {
    "use_env_variable": "DATABASE_URL",
    "dialect": "postgres"
  }
};

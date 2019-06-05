module.exports = {
  development: {
    "username": "admin",
    "password": "admin_pass",
    "database": "nodejs_backend_db",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  production: {
    "use_env_variable": "DATABASE_URL",
    "dialect": "postgres"
  }
};

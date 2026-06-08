module.exports = {
  "development": {
    "use_env_variable": "DATABASE_URL",
    "username": "bazar_db_s472_user",
    "password": "zK1Y6SQY9pLd0br3LzhuKisHnPQOqTho",
    "database": "bazar_db_s472",
    "host": "dpg-d8j65448aovs738vo150-a.oregon-postgres.render.com",
    "port": 5432,
    "dialect": "postgres",
    "dialectOptions": {
      "ssl": {
        "require": true,
        "rejectUnauthorized": false
      }
    }
  },
  "test": {
    "username": "root",
    "password": "",
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": "",
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
};
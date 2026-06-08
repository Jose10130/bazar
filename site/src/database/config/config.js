module.exports = {
"development": {
    "username": "bazar_db_s472_user",
    "password": "zK1Y6SQY9pLd0br3LzhuKisHnPQOqTho",
    "database": "bazar_db_s472", // O el nombre que te dé Aiven
    "host": "postgresql://bazar_db_s472_user:zK1Y6SQY9pLd0br3LzhuKisHnPQOqTho@dpg-d8j65448aovs738vo150-a/bazar_db_s472",
    "port": 5432, // El puerto que te dé Aiven (suele cambiar en la nube)
    "dialect": "mysql"
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
module.exports = {
development: {
  username: "bazar_db_s472_user",
  p paassword: "zK1Y6SQY9pLd0br3LzhuKisHnPQOqTho",
  database: "bazar_db_s472",
  host: "dpg-d8j65448aovs738vo150-a.oregon-postgres.render.com",
  port: 5432,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
},
  test: {
  username: "bazar_db_s472_user",
  password: "zK1Y6SQY9pLd0br3LzhuKisHnPQOqTho",
  database: "bazar_db_s472",
  host: "dpg-d8j65448aovs738vo150-a.oregon-postgres.render.com",
  port: 5432,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
  },
  production: {
    username: "bazar_db_s472_user",
    password: "zK1Y6SQY9pLd0br3LzhuKisHnPQOqTho",
    database: "bazar_db_s472",
    host: "dpg-d8j65448aovs738vo150-a.oregon-postgres.render.com",
    port: 5432,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  } // <--- 1. Esta llave cierra el bloque de "production"
}; // <--- 2. Esta llave con punto y coma cierra todo el archivo (module.exports)
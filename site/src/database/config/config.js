module.exports = {
development: {
  username: "bazar_db_s472_user",
  password: "zK1Y6SQY9pLd0br3LzhuKisHnPQ0qTho",
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
  password: "zK1Y6SQY9pLd0br3LzhuKisHnPQ0qTho",
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
  password: "zK1Y6SQY9pLd0br3LzhuKisHnPQ0qTho",
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
};
require('dotenv').config();
module.exports = {
  development: {
    username: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE_NAME,
    host: process.env.HOST_DB,
    dialect: 'postgres',
    port: process.env.PORT_DB,
  },
  production: {
    username: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE_NAME,
    host: process.env.HOST_DB,
    dialect: 'postgres',
    port: process.env.PORT_DB,
  },
  test: {
    username: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE_NAME,
    host: process.env.HOST_DB,
    dialect: 'postgres',
    port: process.env.PORT_DB,
  },
};

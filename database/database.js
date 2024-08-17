//============================
//Creating DB Connection
//============================
require('dotenv').config();
const { Sequelize } = require('sequelize');
const sequelizedata = new Sequelize(
  process.env.dbName,
  process.env.dbUser,
  process.env.dbPass,
  {
    host: process.env.dbServer,
    port: process.env.dbPort,
    dialect: 'mysql',
  }
);

try {
  sequelizedata.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
module.exports = sequelizedata;

const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  host:process.env.DB_HOST, 
  url: process.env.DB_URL,
  database: process.env.DB_NAME,
  dialect: process.env.DB_DIALECT,
  storage: './__tests__/database.sqlite',
  operatorAliases: false,
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  }
};
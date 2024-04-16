/* Import MySQL configuration from '.env' */
require('dotenv-flow').config();

const { MYSQL_HOST, MYSQL_USERNAME, MYSQL_ROOT_PASSWORD, MYSQL_PORT, MYSQL_DATABASE } = process.env;

/* Construct DB_URL from parameters */
const DB_URL = "mysql://"+MYSQL_USERNAME+":"+MYSQL_ROOT_PASSWORD+"@"+MYSQL_HOST+":"+MYSQL_PORT+"/"+MYSQL_DATABASE

console.log("Connect to MySQL-server: "+MYSQL_USERNAME+":"+"*".repeat(MYSQL_ROOT_PASSWORD.length)+"@"+MYSQL_HOST+":"+MYSQL_PORT + "/" + MYSQL_DATABASE);

/* Setup with mysql and export */
module.exports = {
  client: 'mysql',
  connection: {
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    user: MYSQL_USERNAME,
    password: MYSQL_ROOT_PASSWORD,
    database: MYSQL_DATABASE,
  },
  migrations: {
    directory: __dirname + '/server/migrations'
  }
};
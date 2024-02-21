/* Import MySQL configuration from '.env' */
require('dotenv-flow').config();

/* Construct DB_URL from parameters */
const DB_URL = "mysql://"+process.env.MYSQL_USERNAME+":"+process.env.MYSQL_ROOT_PASSWORD+"@"+process.env.MYSQL_HOST+":"+process.env.MYSQL_PORT+"/"+process.env.MYSQL_DATABASE

console.log("Connect to MySQL-server: "+process.env.MYSQL_DATABASE+"@"+process.env.MYSQL_HOST+":"+process.env.MYSQL_PORT);

/* Setup with mysql and export */
module.exports = {
  client: 'mysql',
  connection: DB_URL,
  migrations: {
    directory: __dirname + '/server/migrations'
  }
};
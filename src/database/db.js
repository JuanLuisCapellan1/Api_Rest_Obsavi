const mysql = require('mysql2')
const config = require('../config')

const connection = mysql.createConnection({
    host: config.HOST,
    user: config.DB_USER,
    password: config.PASSWORD,
    port: config.DB_PORT,
    database: config.DATABASE,
})

connection.connect(function(err){
  if(err){
    throw err
  }else{
    console.log('Database connected!')
  }
})

const getConnection = async () => {
  return connection
};

module.exports = { getConnection }

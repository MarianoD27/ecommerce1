const Pool = require('pg').Pool

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ecommerce1',
  password: 'root',
  port: '5432'
})

module.exports = pool
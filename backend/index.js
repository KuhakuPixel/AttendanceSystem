
const express = require('express')
const app = express()
const port = 3005

const mysql = require('mysql2/promise');

(async function () {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'password',
    database: 'db'
  })

  await connection.connect()

  const [rows, fields] = await connection.query('SELECT 1 + 1 AS solution');
  console.log('The solution is: ', rows[0].solution)


  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.post('/register-admin', (req, res) => {
    res.send('Hello World!')
  })

  app.listen(port, (error) => {
    console.log(`Example app listening on port ${port}`)
    console.log(`error: ${error}`)
  })
})();

const express = require('express')
const app = express()
const port = 3005

const mysql = require('mysql2/promise');
var bodyParser = require('body-parser');
// parse application/json
app.use(bodyParser.json());

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
    console.log(req.body);
    res.send('Hello World!')
  })

  app.post('/register-employee', (req, res) => {
    res.send('Hello World!')
  })

  app.post('/login', (req, res) => {
    res.send('Hello World!')
  })

  app.listen(port, (error) => {
    console.log(`Example app listening on port ${port}`)
    console.log(`error: ${error}`)
  })
})();
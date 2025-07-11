
const TOKEN_LENGTH = 128;
const express = require('express')
const app = express()
const HttpStatus = require('http-status-codes');
const crypto = require("crypto");
const id = crypto.randomBytes(20).toString('hex');
const port = 3005

const mysql = require('mysql2/promise');
var bodyParser = require('body-parser');
const { User, UserAttendance, UserSession } = require('./model');

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

  app.post('/register-admin', async (req, res) => {
    console.log(req.body);
    let user = new User(
      req.body["username"],
      req.body["email"],
      req.body["age"],
      req.body["password"],
      true
    );

    try {
      await user.save(connection);
      res.send('account created');
    }
    catch (error) {
      res.status(HttpStatus.StatusCodes.BAD_REQUEST).send(error["message"]);
    }
  })

  app.post('/register-employee', async (req, res) => {
    res.send('Hello World!')
    console.log(req.body);
    let user = new User(
      req.body["username"],
      req.body["email"],
      req.body["age"],
      req.body["password"],
      false
    );

    try {
      await user.save(connection);
      res.send('account created');
    }
    catch (error) {
      res.status(HttpStatus.StatusCodes.BAD_REQUEST).send(error["message"]);
    }
  })

  app.post('/login', async (req, res) => {
    try {
      let user = await User.getUserByEmail(connection, req.body["email"]);
      if (user.password != req.body["password"]) {
        res.send("wrong password");

      } else {
        let user_session = new UserSession(user.id, crypto.randomBytes(TOKEN_LENGTH).toString('hex'));
        user_session.save(connection);
        res.send("ok");
      }
    }
    catch (error) {
      console.log("error is " + error);
      res.status(HttpStatus.StatusCodes.BAD_REQUEST).send(error.toString());
    }
  })

  app.get('/attendances', (req, res) => {
    res.send('Hello World!')
  })

  app.listen(port, (error) => {
    console.log(`Example app listening on port ${port}`)
    console.log(`error: ${error}`)
  })
})();
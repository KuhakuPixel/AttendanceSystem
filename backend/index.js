const TOKEN_LENGTH = 128
const express = require('express')
const cors = require('cors');
const HttpStatus = require('http-status-codes')
const crypto = require('crypto')
const id = crypto.randomBytes(20).toString('hex')


const mysql = require('mysql2/promise')

var bodyParser = require('body-parser')
const { User, UserAttendance, UserSession } = require('./model')
const { requireLogin } = require('./auth');
const { validateUserJson, validateLoginJson } = require('./validate');

const port = 3005
const app = express()
app.use(cors());
// parse application/json
app.use(bodyParser.json())
  ; (async function () {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'user',
      password: 'password',
      database: 'db'
    })

    await connection.connect()

    const [rows, fields] = await connection.query('SELECT 1 + 1 AS solution')
    console.log('The solution is: ', rows[0].solution)

    app.get('/', (req, res) => {
      res.send('Hello World!')
    })

    app.post('/register-admin', async (req, res) => {
      console.log(req.body)
      let validateError = validateUserJson(req.body)
      if (validateError.length > 0) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).send(validateError)
        return;
      }

      let user = new User(
        req.body['username'],
        req.body['email'],
        req.body['age'],
        req.body['password'],
        true
      )

      try {
        await user.save(connection)
        res.send('account created')
      } catch (error) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).send(error['message'])
      }
    })

    app.post('/register-employee', async (req, res) => {
      console.log(req.body)
      let validateError = validateUserJson(req.body)
      if (validateError.length > 0) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).send(validateError)
        return;
      }
      let user = new User(
        req.body['username'],
        req.body['email'],
        req.body['age'],
        req.body['password'],
        false
      )

      try {
        await user.save(connection)
        res.send('account created')
      } catch (error) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).send(error['message'])
      }
    })

    app.post('/login', async (req, res) => {
      let validateError = validateLoginJson(req.body)
      if (validateError.length > 0) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).send(validateError)
        return;
      }
      try {
        let user = await User.getUserByEmail(connection, req.body['email'])
        if (user.password != req.body['password']) {
          res.status(HttpStatus.StatusCodes.UNAUTHORIZED).send("wrong password");

        } else {
          let token = crypto.randomBytes(TOKEN_LENGTH).toString('hex')
          let user_session = new UserSession(user.id, token)
          user_session.save(connection)
          res.send(token)
        }
      } catch (error) {
        console.log('error is ' + error)
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).send(error.toString())
      }
    })

    app.get('/users', async (req, res) => {
      let user = null
      try {
        user = await requireLogin(connection, req, true)
      } catch (error) {
        res.status(HttpStatus.StatusCodes.UNAUTHORIZED).send(error.toString())
        return
      }

      const users = await User.getAll(connection)
      console.log('users ' + users)
      res.send(users)
    })

    app.put('/users/:id', async (req, res) => {
      let user = null
      try {
        user = await requireLogin(connection, req, true)
      } catch (error) {
        res.status(HttpStatus.StatusCodes.UNAUTHORIZED).send(error.toString())
        return
      }

      let user_to_update = null
      try {
        user_to_update = await User.getUserById(connection, req.params['id'])
      } catch (error) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).send(error.toString())
        return
      }
      console.log(user_to_update)

      let validateError = validateUserJson(req.body)
      if (validateError.length > 0) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).send(validateError)
        return;
      }

      Object.assign(user_to_update, req.body)
      try {
        await user_to_update.save(connection)
      } catch (error) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).send(error.toString())
        return
      }
      res.send(user_to_update);
    })

    app.delete('/users/:id', async (req, res) => {
      let user = null
      try {
        user = await requireLogin(connection, req, true)
      } catch (error) {
        res.status(HttpStatus.StatusCodes.UNAUTHORIZED).send(error.toString())
        return
      }

      let user_to_delete = null
      try {
        user_to_delete = await User.getUserById(connection, req.params['id'])
      } catch (error) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).send(error.toString())
        return
      }
      await user_to_delete.delete(connection)
      res.send();
    })

    app.get('/attendances', async (req, res) => {
      let user = null
      try {
        user = await requireLogin(connection, req, true)
      } catch (error) {
        res.status(HttpStatus.StatusCodes.UNAUTHORIZED).send(error.toString())
        return
      }
      let results = await UserAttendance.getAll(connection)
      res.send(results)
    })

    app.get('/my-attendances-today', async (req, res) => {
      let user = null
      try {
        user = await requireLogin(connection, req, true)
      } catch (error) {
        res.status(HttpStatus.StatusCodes.UNAUTHORIZED).send(error.toString())
        return
      }

      var d = new Date()
      let results = await UserAttendance.getByDate(connection, d, user.id)
      res.send(results)
    })

    app.get('/my-attendances', async (req, res) => {
      let user = null
      try {
        user = await requireLogin(connection, req, false)
      } catch (error) {
        res.status(HttpStatus.StatusCodes.UNAUTHORIZED).send(error.toString())
        return
      }

      let results = await UserAttendance.getAllByUser(connection, user.id)
      res.send(results)
    })

    app.post('/checkin', async (req, res) => {
      let user = null
      try {
        user = await requireLogin(connection, req, false)
      } catch (error) {
        res.status(HttpStatus.StatusCodes.UNAUTHORIZED).send(error.toString())
        return
      }
      var d = new Date()
      if (req.body["photo"].length == 0) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).send("photo is required for checkin")
        return;
      }
      let user_attendance = new UserAttendance(user.id, d, req.body["photo"], 'checkin')
      await user_attendance.save(connection)
      res.send('ok')
    })

    app.post('/checkout', async (req, res) => {
      let user = null
      try {
        user = await requireLogin(connection, req, false)
      } catch (error) {
        res.status(HttpStatus.StatusCodes.UNAUTHORIZED).send(error.toString())
        return
      }
      var d = new Date()

      let user_attendance = new UserAttendance(user.id, d, '', 'checkout')
      await user_attendance.save(connection)
      res.send('ok')
    })


    app.get('/profile', async (req, res) => {
      let user = null
      try {
        user = await requireLogin(connection, req, false)
        res.send(user)
      } catch (error) {
        res.status(HttpStatus.StatusCodes.UNAUTHORIZED).send(error.toString())
        return
      }
    })


    app.listen(port, error => {
      console.log(`Example app listening on port ${port}`)
      console.log(`error: ${error}`)
    })
  })()
/**
 * TODO:
 * - api for making attendances
 * - view attendances
 *
 * - delete/update employee data
 *
 */
//
//
//

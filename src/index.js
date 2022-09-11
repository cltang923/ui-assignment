import express from 'express'
import bodyParser from 'body-parser'
import { User } from './utils/postgres/data.js'
import { verifyToken } from './middleware.js'

const app = express()

const port = 8080
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/*
    * [GET] list all users.
*/
app.get('/users', verifyToken, async (req, res) => {
  let users = []
  const { offset, limit } = req.query
  try {
    users = await User.findAll({
      attributes: ['id', 'acct', 'fullname'],
      order: [['id', 'ASC']],
      offset,
      limit
    })
  } catch (err) {
    const errMsg = `failed to list all users : ${err}`
    console.error(errMsg)
    return res.status(500).send({ errMsg })
  }
  return res.status(200).send(users)
})

/*
    * [GET] search an user by fullname.
*/
app.get('/user', verifyToken, async (req, res) => {
  let user
  const { name } = req.query
  try {
    user = await User.findOne({
      attributes: ['id', 'acct', 'fullname'],
      where: {
        fullname: name
      }
    })
    if (!user) {
      throw new Error(`user ${name} not found`)
    }
  } catch (err) {
    const errMsg = `failed to search an user by fullname : ${err}`
    console.error(errMsg)
    return res.status(500).send({ errMsg })
  }
  return res.status(200).send(user)
})

app.listen(port, (err) => {
  if (err) {
    return console.error(err)
  }
  return console.log(`Listening at http://localhost:${port}`)
})

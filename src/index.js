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

app.listen(port, (err) => {
  if (err) {
    return console.error(err)
  }
  return console.log(`Listening at http://localhost:${port}`)
})

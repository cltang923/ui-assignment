import express from 'express'
import bodyParser from 'body-parser'
import { User } from './utils/postgres/data.js'
import { verifyToken, verifySignInRequest } from './middleware.js'
import jwt from 'jsonwebtoken'
import { getConfig } from './utils/config.js'
import isEmpty from 'lodash/isEmpty.js'

const app = express()

const port = 8080
const DAY_IN_SECONDS = 60 * 60 * 24
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

/*
    * [GET] get the user’s detailed information by given acct.
*/
app.get('/user/:acct', verifyToken, async (req, res) => {
  let user
  const { acct } = req.params
  try {
    user = await User.findByPk(acct, { attributes: ['id', 'acct', 'fullname'] })
    if (!user) {
      throw new Error('user not found')
    }
  } catch (err) {
    const errMsg = `failed to get user's detail info by id ${acct} : ${err}`
    console.error(errMsg)
    return res.status(500).send({ errMsg })
  }
  return res.status(200).send(user)
})

/*
    * [POST] sign up. (create user)
*/
app.post('/user/:name', verifySignInRequest, async (req, res) => {
  let user
  const { name } = req.params
  const { acct, pwd } = req.body
  if (isEmpty(name)) {
    return res.status(400).send({ errMsg: 'name is empty' })
  }
  try {
    user = await User.findByPk(acct)
    if (!isEmpty(user)) {
      throw new Error(`account ${acct} already exist`)
    }
    // create user
    await User.create({ acct, fullname: name, pwd })
  } catch (err) {
    const errMsg = `failed to sign up for user ${acct} : ${err}`
    console.error(errMsg)
    return res.status(500).send({ errMsg })
  }
  return res.status(200).end()
})

/*
    * [POST] user sign in.
*/
app.post('/user', verifySignInRequest, async (req, res) => {
  let token
  let user
  const { acct, pwd } = req.body
  try {
    user = await User.findByPk(acct)
    if (isEmpty(user)) {
      throw new Error(`account ${acct} not exist`)
    }
    if (pwd !== user.pwd) {
      throw new Error('password is wrong')
    }
    const { privateKey } = getConfig()
    token = jwt.sign({ acct: user.acct }, privateKey, {
      expiresIn: DAY_IN_SECONDS,
      algorithm: 'RS256'
    })
  } catch (err) {
    const errMsg = `failed to sign up for user ${acct} : ${err}`
    console.error(errMsg)
    return res.status(500).send({ errMsg })
  }
  return res.status(200).send({ token })
})

/*
    * [DELETE] delete user by given acct
*/
app.delete('/user/:acct', verifyToken, async (req, res) => {
  const { acct } = req.params
  try {
    const user = await User.findByPk(acct)
    if (isEmpty(user)) {
      throw new Error(`account ${acct} not exist`)
    }
    await User.destroy({ where: { acct } })
  } catch (err) {
    const errMsg = `failed to delete user ${acct} : ${err}`
    console.error(errMsg)
    return res.status(500).send({ errMsg })
  }
  return res.status(200).end()
})

/*
    * [PUT] update user by given object
*/
app.put('/user/:acct', verifyToken, async (req, res) => {
  let token
  const { acct } = req.params
  const { name, pwd } = req.body
  try {
    if (isEmpty(pwd)) {
      throw new Error('password is empty')
    }
    if (isEmpty(name)) {
      throw new Error('name is empty')
    }
    const user = await User.findByPk(acct)
    if (isEmpty(user)) {
      throw new Error(`account ${acct} not exist`)
    }
    await User.update({ fullname: name, pwd }, { where: { acct } })
  } catch (err) {
    const errMsg = `failed to update user ${acct} : ${err}`
    console.error(errMsg)
    return res.status(500).send({ errMsg })
  }
  return res.status(200).send({ token })
})

app.listen(port, (err) => {
  if (err) {
    return console.error(err)
  }
  return console.log(`Listening at http://localhost:${port}`)
})

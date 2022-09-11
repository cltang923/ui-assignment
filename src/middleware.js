import jwt from 'jsonwebtoken'
import isEmpty from 'lodash/isEmpty.js'
import { getConfig } from './utils/config.js'
import { User } from './utils/postgres/data.js'

export const verifyToken = async (
  req,
  res,
  next
) => {
  const { 'x-access-token': token } = req.headers
  const { publicKey } = getConfig()
  if (!token) {
    return res.status(403).send({ errMsg: 'No token provided.' })
  }
  try {
    const { acct } = jwt.verify(token, publicKey, { algorithms: 'RS256' })
    const user = await User.findByPk(acct)
    if (isEmpty(user)) {
      throw new Error(`account ${acct} not exist`)
    }
  } catch (err) {
    const errMsg = `failed to verify token: ${err}`
    console.log(errMsg)
    return res.status(400).send({ errMsg })
  }
  next()
}

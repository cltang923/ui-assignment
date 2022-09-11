
import { Sequelize } from 'sequelize'
import { SQL } from './index.js'

const sql = new SQL()

export const User = sql.sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true
  },
  acct: {
    type: Sequelize.STRING,
    defaultValue: false,
    primaryKey: true
  },
  pwd: {
    type: Sequelize.STRING,
    defaultValue: false
  },
  fullname: {
    type: Sequelize.STRING,
    defaultValue: ''
  }
})

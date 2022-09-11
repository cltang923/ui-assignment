import { getConfig } from '../config.js'
import { Sequelize } from 'sequelize'

let instance
export class SQL {
  constructor () {
    const { sqlDB, sqlUser, sqlPassword } = getConfig()
    this.sequelize = new Sequelize(sqlDB, sqlUser, sqlPassword, {
      host: 'postgres',
      dialect: 'postgres'
    })
    instance = this
    return instance
  }
}

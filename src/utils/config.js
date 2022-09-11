import path, { dirname } from 'path'
import fs from 'fs'
import isEmpty from 'lodash/isEmpty.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const configPath = path.resolve(__dirname, '../config/config.json')
let config = {}

export const getConfig = () => {
  if (!isEmpty(config)) {
    return config
  }
  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath).toString())
  }
  return config
}

export const writeIntoConfig = (config) => {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
  console.log('config updated')
}

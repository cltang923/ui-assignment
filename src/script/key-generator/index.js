import crypto from 'crypto'
import get from 'lodash/get.js'
import isEmpty from 'lodash/isEmpty.js'
import { getConfig, writeIntoConfig } from '../../utils/config.js'

const keyGenerator = () => {
  return crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  })
}

const main = () => {
  const config = getConfig()
  if (!isEmpty(get(config, 'publicKey')) && !isEmpty(get(config, 'privateKey'))) {
    console.log('key is already created.')
    return
  }
  const { privateKey, publicKey } = keyGenerator()
  config.privateKey = privateKey
  config.publicKey = publicKey
  writeIntoConfig(config)
}

main()

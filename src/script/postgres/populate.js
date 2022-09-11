import { User } from '../../utils/postgres/data.js'

export const populate = async () => {
  await User.sync()
  console.log('create User table successfully')
}

populate()

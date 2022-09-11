import { User } from '../../utils/postgres/data.js'

const populate = async () => {
  await User.sync()
}

populate()

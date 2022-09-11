import { exec, execSync } from 'child_process'
import { getConfig } from '../../utils/config.js'

// run progress
const runPostgres = () => {
  try {
    execSync('docker start postgres')
    console.log('postgres is running')
  } catch (error) {
    const { sqlDB, sqlUser, sqlPassword } = getConfig()
    // container postgres doesn't exist. create.
    const postgres = exec(`docker run --name postgres -p 5432:5432 -e POSTGRES_DB=${sqlDB} -e POSTGRES_USER=${sqlUser} -e POSTGRES_PASSWORD=${sqlPassword} -d postgres`)
    postgres.stdout.on('data', (data) => {
      console.log(`[postgres] ${data}`)
    })
    postgres.stderr.on('data', (data) => {
      console.log(`[postgres][error] ${data}`)
    })
  }
}

runPostgres()

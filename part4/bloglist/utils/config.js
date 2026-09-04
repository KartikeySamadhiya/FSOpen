const dns = require('dns')
dns.setServers(['8.8.8.8', '1.1.1.1'])

require ('dotenv').config()
//require('dns').setDefaultResultOrder('ipv4first')

const PORT = process.env.PORT || 3003
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI
const SECRET = process.env.SECRET

module.exports = {
  MONGODB_URI,
  PORT,
  SECRET
}
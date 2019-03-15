const mysql = require('mysql')
const _ = require('lodash')

module.exports = (config, parameters) =>new Promise(async (resolve, reject)=>{
  const connectTimeout = parameters.arguments('mysqlConnectionTimeout', 'lastArgument', 200)
  config = Object.assign(config, {connectTimeout})
  const connection = mysql.createConnection(config)
  connection.connect(function(err) {
    let connectionStatus = 'ok'
    let msg=''
    if (err) {
      connectionStatus = status = 'bad'
      msg = err.errno
      console.log(err)
    }
    connection.end()

    resolve({status: connectionStatus, msg, config: _.omit(config, 'password')})
  })
})

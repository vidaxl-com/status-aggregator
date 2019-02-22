const mysql = require('mysql')
module.exports = (config) =>new Promise(async (resolve, reject)=>{
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
    resolve({status: connectionStatus, msg, config})
  })
})

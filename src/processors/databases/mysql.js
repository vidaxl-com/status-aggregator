const mysql = require('mysql')
const util = require('util')

const connector = (config) =>new Promise(async (resolve, reject)=>{
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

module.exports = (mysqlConfigs) => new Promise(async (resolve, reject)=>{
  const results = []
  let status = 'ok'
  for(let i = 0; i<mysqlConfigs.length; i++ ){
    const mysqlConfig = mysqlConfigs[i]
    const result = await connector(mysqlConfig)
    if(result.status === 'bad'){
      status = 'bad'
    }
    results.push(result)
  }
  // if(results.length)
  // l(results,"FFF")()

  resolve({results, status})
})

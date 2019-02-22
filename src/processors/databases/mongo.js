const mongoClient = require('mongodb').MongoClient

module.exports = (config) =>new Promise(async (resolve, reject)=>{
  mongoClient.connect(config, function(err, client) {
    let status = 'ok'
    const weAreConnected = err === null
    if(!weAreConnected){
      status = 'bad'
    }
    resolve({status})
    if(weAreConnected){
      client.close();
    }
  })
})

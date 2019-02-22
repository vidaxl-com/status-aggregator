const mongoClient = require('mongodb').MongoClient

const connector = (config) =>new Promise(async (resolve, reject)=>{
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

module.exports = (configs) => new Promise(async (resolve, reject)=>{
  const results = []
  let status = 'ok'
  for(let i = 0; i<configs.length; i++ ){
    const config = configs[i]
    const result = await connector(config)
    // l(result)()
    if(result.status === 'bad'){
      status = 'bad'
    }
    results.push(result)
  }

  resolve({results, status})
})

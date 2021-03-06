// const client = require('nano')
const axios = require('axios')
module.exports = (config, parameters) =>new Promise(async (resolve, reject)=>{
  let status = 'ok'
  let data = {}
  try{
    if(config.host && config.port){
      config = require('addhttp')(config.host + ':' + config.port);
    }
    data = await axios.get(config,{
      timeout: 1000
    })
  }
  catch (e) {
    status = 'bad'
  }

  if(data.status !== 200){
    status = 'bad'
  }

  // l(data)()

  resolve({status, data:data.data})
})

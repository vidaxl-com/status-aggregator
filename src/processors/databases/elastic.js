const elasticsearch = require('elasticsearch');

module.exports = (config, parameters) =>new Promise(async (resolve, reject)=>{
  let client = new elasticsearch.Client(config);
  let status = 'ok'
  try {
    client.ping({
      requestTimeout: 1000,
    }, function (error) {
      if (error) {
        status = 'bad'
      }
    })
  } catch (e) {
    status = 'bad'
  }

  resolve({status})
})

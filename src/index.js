const dslFramework = require('dsl-framework').noPromoises()
  op = require('object-path')
  , flatten = require('array-flatten')
  , sendStatusReport = async (res, resultingData, oldStyleRequest) =>
        new Promise((resolve, reject) =>{
          const {responseSend} = require('./sever-data-adapters/express-restify-adapter')(oldStyleRequest)
          responseSend(res, resultingData)
          resolve(resultingData)
        })
  , jsUcfirst = (string) => string.charAt(0).toUpperCase() + string.slice(1)
  , getDbResults = (dbType, parameters) => new Promise(async (resolve, reject) => {
      const result = await require('./processors/databases/base')
      (require(`./processors/databases/${dbType}`))
      (flatten(parameters.arguments(`add${jsUcfirst(dbType)}`, 'allEntries', [])))

      resolve(result)
    })

module.exports= dslFramework(
  (e, parameters) => {
    let extraData = parameters.arguments('addExtraData', 'allEntries')
    extraData = !!extraData ? flatten(extraData) : false
    const res = parameters.arguments('addResponse', 'lastArgument')
      , oldStyleRequest = parameters.command.has('oldStyleRequest')

    let name = parameters.arguments('name', 'lastArgument',"undefined name")
    return new Promise(async (resolve, reject) => {
      let mysqlResults = await getDbResults('mysql', parameters)
      let mongoResults = await getDbResults('mongo', parameters)
      let couchdbResults = await getDbResults('couchdb', parameters)
      let elasticResults = await getDbResults('elastic', parameters)
      let statusAggregatorResults = await require('./processors/status-aggregator')(parameters)

      let status =
        statusAggregatorResults.status === 'ok' &&
        (mysqlResults.status === 'ok') &&
        (mongoResults.status === 'ok') &&
        (couchdbResults.status === 'ok') ? 'ok' : 'bad'

      let resolveData = {status, statusAggregatorResults, name}

      if(extraData){
        resolveData = Object.assign(resolveData,{extraData})
      }
      if(mysqlResults.results.length){
        resolveData = Object.assign(resolveData,{mysqlResults})
      }
      if(mongoResults.results.length){
        resolveData = Object.assign(resolveData,{mongoResults})
      }
      if(couchdbResults.results.length){
        resolveData = Object.assign(resolveData,{couchdbResults})
      }
      if(elasticResults.results.length){
        resolveData = Object.assign(resolveData,{elasticResults})
      }
      op.set(resolveData, 'info.version.status-aggregator', require('../package.json').version)
      op.set(resolveData, 'info.version.node', process.version)
      op.set(resolveData, 'info.server.uptime', require('server-uptime'))

      resolve(resolveData)
      if(res){
        sendStatusReport(res, resolveData, oldStyleRequest)
      }
    })
  }
)

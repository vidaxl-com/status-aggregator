const dslFramework = require('dsl-framework').noPromoises()
  , flatten = require('array-flatten')
  , sendStatusReport = async (res, resultingData, oldStyleRequest) =>
        new Promise((resolve, reject) =>{
          const {responseSend} = require('./sever-data-adapters/express-restify-adapter')(oldStyleRequest)
          responseSend(res, resultingData, oldStyleRequest)
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

      let resolveData = {statusAggregatorResults, name, status}

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

      resolve(resolveData)
      if(res){
        sendStatusReport(res, resolveData, oldStyleRequest)
      }
    })
  }
)

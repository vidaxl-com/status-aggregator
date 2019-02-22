const dslFramework = require('dsl-framework').noPromoises()
  , flatten = require('array-flatten')
  , sendStatusReport = async (res, resultingData, oldStyleRequest) =>
        new Promise((resolve, reject) =>{
          const {responseSend} = require('./sever-data-adapters/express-restify-adapter')(oldStyleRequest)
          responseSend(res, resultingData, oldStyleRequest)
          resolve(resultingData)
        })


module.exports= dslFramework(
  (e, parameters) => {
    let extraData = parameters.arguments('addExtraData', 'allEntries')
    extraData = !!extraData ? flatten(extraData) : false
    const res = parameters.arguments('addResponse', 'lastArgument')
      , oldStyleRequest = parameters.command.has('oldStyleRequest')

    let name = parameters.arguments('name', 'lastArgument',"undefined name")
    return new Promise(async (resolve, reject) => {
      let mysqlResults = await require('./processors/databases/mysql')(flatten(parameters.arguments('addMysql', 'allEntries', [])))
      let mongoResults = await require('./processors/databases/mongo')(flatten(parameters.arguments('addMongo', 'allEntries', [])))
      let statusAggregatorResults = await require('./processors/status-aggregator')(parameters)
      let status = statusAggregatorResults.status === 'ok' && mysqlResults.status === 'ok' ? 'ok' : 'bad'
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

      resolve(resolveData)
      if(res){
        sendStatusReport(res, resolveData, oldStyleRequest)
      }
    })
  }
)

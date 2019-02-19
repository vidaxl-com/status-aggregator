const dslFramework = require('dsl-framework').noPromoises()
  , flatten = require('array-flatten')
  , sendStatusReport = async (res, resultingData) =>
        new Promise((resolve, reject) =>{
          const {responseSend} = require('./sever-data-adapters/express-restify-adapter')
          responseSend(res, resultingData)
          resolve(resultingData)
        })


module.exports= dslFramework(
  (e, parameters) => {
    let extraData = parameters.arguments('addExtraData', 'allEntries')
    extraData = !!extraData ? flatten(extraData) : false
    const res = parameters.arguments('addResponse', 'lastArgument')
    let name = parameters.arguments('name', 'lastArgument',"undefined name")
    return new Promise(async (resolve, reject) => {
      let statusAggregatorResults = await require('./pocessors/status-aggregator')(parameters)
      const resolveData = {statusAggregatorResults, name}
      if(extraData){
        resolveData.extraData = extraData
      }

      resolve(resolveData)
      if(res){
        sendStatusReport(res, resolveData)
      }
    })
  }
)

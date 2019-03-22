const{
  sendStatusReport,
  getDbResults,
} = require('./core/index')
const flatten = require('array-flatten')
const dslFramework = require('dsl-framework').noPromoises.noTriggerEndOfExecution()
module.exports= dslFramework(
  (e, parameters) => {

    let extraData = parameters.arguments('addExtraData', 'allEntries')
    extraData = !!extraData ? flatten(extraData) : false
    const res = parameters.arguments('addResponse', 'lastArgument')
      , oldStyleRequest = parameters.command.has('oldStyleRequest')
      , queryParameterValueGetter = require('./query-parameter-value-getter')(parameters)
      , summaryMode = queryParameterValueGetter('summary', ()=>false)
      , flatMode = queryParameterValueGetter('flat', ()=>false)
    let name = parameters.arguments('name', 'lastArgument',`undefined-name-${require('./lib/random-string-generator')()}`)
    return new Promise(async (resolve, reject) => {

      const data = await Promise.all(
        [getDbResults('mysql', parameters),
        getDbResults('mongo', parameters),
        getDbResults('couchdb', parameters),
        getDbResults('elastic', parameters),
        require('./processors/status-aggregator')(parameters)]
      )

      let mysqlResults = data[0]
      let mongoResults = data[1]
      let couchdbResults = data[2]
      let elasticResults = data[3]
      let statusAggregatorResults = data[4]


      // let mysqlResults = await getDbResults('mysql', parameters)
      // let mongoResults = await getDbResults('mongo', parameters)
      // let couchdbResults = await getDbResults('couchdb', parameters)
      // let elasticResults = await getDbResults('elastic', parameters)
      // let statusAggregatorResults = await require('./processors/status-aggregator')(parameters)

      let status =
        statusAggregatorResults.status === 'ok' &&
        (mysqlResults.status === 'ok') &&
        (mongoResults.status === 'ok') &&
        (couchdbResults.status === 'ok') ? 'ok' : 'bad'
      let resolveData = {status, name}
      // l(resolveData,summaryMode)()
      dependencies = require('./mode/lib/dependencies')
      (parameters, resolveData, statusAggregatorResults,extraData,mysqlResults,mongoResults,couchdbResults,elasticResults)

      if(!summaryMode){
        resolveData = require('./mode/detailed')(dependencies)
      }
      if(summaryMode){
        resolveData = require('./mode/summary')(dependencies)
      }

      if(flatMode){
        resolveData = require('./mode/flat')(dependencies)
      }

      resolve(resolveData)
      if(res){
        sendStatusReport(res, resolveData, oldStyleRequest)
      }
    })
  }
)

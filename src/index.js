const{
  sendStatusReport,
  getDbResults,
} = require('./core/index')
const flatten = require('array-flatten')
const dslFramework = require('dsl-framework').noPromoises.noTriggerEndOfExecution()
const path = require('path')
const fs = require('fs')
module.exports= dslFramework(
  (e, parameters) => {
    let extraData = parameters.arguments('addExtraData', 'allEntries')
    extraData = !!extraData ? flatten(extraData) : false
    const datePatcher = require('./lib/date-pathcer')()
      , res = parameters.arguments('addResponse', 'lastArgument')
      , oldStyleRequest = parameters.command.has('oldStyleRequest')
      , queryParameterValueGetter = require('./query-parameter-value-getter')(parameters)
      , summaryMode = queryParameterValueGetter('summary', ()=>false)
      , flatMode = queryParameterValueGetter('flat', ()=>false)
      , shallow = queryParameterValueGetter('shallow', ()=>false)
      , mockId = parameters.arguments('mockId', 'lastArgument', require('./lib/random-string-generator')())

    let name = parameters.arguments('name', 'lastArgument',`undefined-name-${require('./lib/random-string-generator')()}`)
    return new Promise(async (resolve, reject) => {
      const databaseModules = fs.readdirSync(path.join(__dirname, 'processors/databases'))
        .filter(item => item!=='base.js')
        .map(item=>item.split('.')[0])
      const databasePromises = databaseModules.map(item => getDbResults(item, parameters))
      // Getting database data.
      const databaseFeedbackData = await Promise.all(
        databasePromises
      )
      let dbStatus = true
      const dbResults = {}
      //mapping and collecting information from the database modules
      databaseFeedbackData.forEach((e,i)=>{
        dbResults[databaseModules[i]+'Results'] = e
        if(dbStatus){
          dbStatus = e.status === 'ok'
        }
      })

      let statusAggregatorResults = false
      if(!shallow){
        statusAggregatorResults = await require('./processors/status-aggregator')(parameters, mockId)
      }

      let status =
        (
          (statusAggregatorResults &&
          statusAggregatorResults.status === 'ok') || !statusAggregatorResults
        )&&
        dbStatus
          ? 'ok' : 'bad'
      let resolveData = {status, name}
      // l(resolveData,summaryMode)()
      dependencies = require('./mode/lib/dependencies')
      (parameters, resolveData, statusAggregatorResults, extraData, dbResults)

      if(!summaryMode){
        resolveData = require('./mode/detailed')(dependencies)
      }
      if(summaryMode){
        resolveData = require('./mode/summary')(dependencies)
      }

      if(flatMode){
        resolveData = require('./mode/flat')(dependencies)
      }

      resolve(datePatcher(resolveData))
      if(res){
        sendStatusReport(res, resolveData, oldStyleRequest)
      }
    })
  }
)

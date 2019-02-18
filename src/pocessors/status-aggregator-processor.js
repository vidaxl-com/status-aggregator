  const apiGetter = require('../data-getters/status-aggregator')
  , flatten = require('array-flatten')

  , dataPatcher = (data, success = true, timeSpan) => {
  const resultingData = Object.assign(
    {
      status:success?'ok':'bad',
      timer:{
        durationMs: timeSpan()(),
        sent:new Date().toUTCString()
      },
    }, data)

  return resultingData
}

module.exports= (parameters) => {
    const timeSpan = require('time-span');
    const statusAggregatorApis = parameters.arguments('addApi', 'allEntries')
    let extraData = parameters.arguments('addExtraData', 'allEntries')
    extraData = !!extraData ? flatten(extraData) : false
    let requestTimeout = parameters.arguments('timeout', 'lastArgument')
    requestTimeout = requestTimeout ? requestTimeout : 1000
    const fail = parameters.command.has('fail')
    const failMsg = parameters.arguments('fail', 'lastArgument')

    return new Promise(async (resolve, reject) => {
      let status = !fail
      let dataSent = {}
      if(status && failMsg){
        dataSent.failMessage = failMsg ? failMsg : 'Failed by request.'
      }
      if(extraData){
        dataSent.extraData = extraData
      }
      let generatedResults = []
      if (statusAggregatorApis) {
        const urlValidationResults = require('./validators/malformedApiUrls')(statusAggregatorApis)
        let msg = ''
        const validUrls = urlValidationResults.ok()
        msg.concat(validUrls ? '' : urlValidationResults.msg())
        const apiGetterResults = await apiGetter(statusAggregatorApis,requestTimeout).catch(e => l(e)())
        const validApiResponses = apiGetterResults.ok()
        msg += (validApiResponses ? '' : apiGetterResults.msg())

        dataSent.msg = msg ? msg:undefined
        generatedResults = apiGetterResults.results
        const somethingWentWrongDuringTheCommunitcation =
          !!generatedResults.filter(item => item.status !== 200).length || !Object.keys(generatedResults).length
        const badApiResponses = require('./validators/badApiResponses')(generatedResults)
        const weHaveBadResponses = !!badApiResponses.length
        status = !weHaveBadResponses && !somethingWentWrongDuringTheCommunitcation && validUrls && validApiResponses && status
      }
      const d = dataPatcher(dataSent, status, timeSpan)
      resolve(d)
    })
  }

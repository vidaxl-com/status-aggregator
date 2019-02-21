  const apiGetter = require('./data-getter')
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
    const timeSpan = require('time-span')
    // , statusAggregatorApis = parameters.arguments('addApi', 'allEntries')
    , requestTimeout = parameters.arguments('timeout', 'lastArgument', 1000)
    , fail = parameters.command.has('fail')
    , failMsg = parameters.arguments('fail', 'lastArgument')
    , looseUrlCheck = parameters.command.has('looseApiUrlCheck')
    let statusAggregatorApis = parameters.arguments('addApi', 'allEntries')


    return new Promise(async (resolve, reject) => {
      let status = !fail
      let dataSent = {}
      if(status && failMsg){
        dataSent.failMessage = failMsg ? failMsg : 'Failed by request.'
      }
      let generatedResults = []
      if (statusAggregatorApis) {
        let msg = ''
        let validUrls = true
        if(!looseUrlCheck){
          const urlValidationResults = require('./validators/malformedApiUrls')(statusAggregatorApis)
          validUrls = urlValidationResults.ok()
          msg.concat(validUrls ? '' : urlValidationResults.msg())
        }
        if(looseUrlCheck){
          statusAggregatorApis = statusAggregatorApis.map(row=>[require('addhttp')(row[0])])
        }
        const apiGetterResults = await apiGetter(statusAggregatorApis, requestTimeout)
        const validApiResponses = apiGetterResults.ok()
        msg += (validApiResponses ? '' : apiGetterResults.msg())
        dataSent.msg = msg ? msg:undefined
        generatedResults = apiGetterResults.results
        //todo: check this validation
        const somethingWentWrongDuringTheCommunitcation =
          !!generatedResults.filter(item => item.httpStatus !== 200).length || !Object.keys(generatedResults).length
        const badApiResponses = require('./validators/badApiResponses')(generatedResults)
        const weHaveBadResponses = !!badApiResponses.length
        status = !weHaveBadResponses && !somethingWentWrongDuringTheCommunitcation && validUrls && validApiResponses && status
      }
      const d = dataPatcher(dataSent, status, timeSpan)
      d.generatedResults = generatedResults;
      resolve(d)
    })
  }

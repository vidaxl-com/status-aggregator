  const apiGetter = require('./data-getter')
  , dataPatcher = (data, success = true, timeSpan) => {
    if(!data.failMessage){
      delete data.failMessage
    }
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
, op = require('object-path')

module.exports= (parameters) => {
    const timeSpan = require('time-span')
    // , statusAggregatorApis = parameters.arguments('addApi', 'allEntries')
    , requestTimeout = parameters.arguments('timeout', 'lastArgument', 1000)
    , fail = parameters.command.has('fail')
    , failMsg = parameters.arguments('fail', 'lastArgument')
    , looseUrlCheck = parameters.command.has('looseApiUrlCheck')
    let statusAggregatorApis = parameters.arguments('addApi', 'allEntries')

    return new Promise(async (resolve, reject) => {
      let dataSent = {}
      dataSent.failMessage = ''

      if(fail){
        dataSent.failMessage = failMsg ? failMsg : 'Failed by request.\n'
      }
      let generatedResults = []

      let stat = !fail

      if (statusAggregatorApis) {
        let validUrls = true
        if(!looseUrlCheck){
          const urlValidationResults = require('./validators/malformedApiUrls')(statusAggregatorApis, looseUrlCheck)
          validUrls = urlValidationResults.ok()
          dataSent.failMessage += urlValidationResults.msg()
        }
        if(looseUrlCheck){
          statusAggregatorApis = statusAggregatorApis.map(row=>[require('addhttp')(row[0])])
        }
        const apiGetterResults = await apiGetter(statusAggregatorApis, requestTimeout)
        const validApiResponses = apiGetterResults.ok()

        dataSent.failMessage += validApiResponses ? '' : apiGetterResults.msg()
        // dataSent.msg = msg ? msg:''
        generatedResults = apiGetterResults.results

        //todo: check this validation
        const somethingWentWrongDuringTheCommunitcation =
          !!generatedResults.filter(item => item.httpStatus !== 200).length
        if(somethingWentWrongDuringTheCommunitcation){
          dataSent.failMessage += 'One of the http status of the responses was different than 200.\n'
        }

        const badApiResponses = require('./validators/badApiResponses')(generatedResults)
        const weHaveBadResponses = !!badApiResponses.length

        if(somethingWentWrongDuringTheCommunitcation){
          dataSent.failMessage += 'Some status-aggregator messages are "bad".\n'
        }

        stat = !weHaveBadResponses && !somethingWentWrongDuringTheCommunitcation && validUrls && validApiResponses && !fail
        op.set(dataSent,'debug.status', stat)
        op.set(dataSent,'debug.notWeHaveBadResponses', !weHaveBadResponses)
        op.set(dataSent,'debug.notSomethingWentWrongDuringTheCommunitcation', !somethingWentWrongDuringTheCommunitcation)
        op.set(dataSent,'debug.validUrls', validUrls)
        op.set(dataSent,'debug.validApiResponses', validApiResponses)
        op.set(dataSent,'debug.notFail', !fail)

        // l( !weHaveBadResponses && !somethingWentWrongDuringTheCommunitcation && validUrls && validApiResponses && !fail, stat)()
      }
      const d = dataPatcher(dataSent, stat, timeSpan)
      d.generatedResults = generatedResults;
      resolve(d)
    })
  }

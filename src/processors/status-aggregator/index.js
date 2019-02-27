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
    , requestTimeout = parameters.arguments('timeout', 'lastArgument', 1000)
    , fail = parameters.command.has('fail')
    , debug = parameters.command.has('debug')
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

        const apiGetterResults = await apiGetter(statusAggregatorApis, requestTimeout, looseUrlCheck)
        const validApiResponses = apiGetterResults.ok()

        dataSent.failMessage += validApiResponses ? '' : apiGetterResults.msg()
        // dataSent.msg = msg ? msg:''
        generatedResults = apiGetterResults.results

        //todo: check this validation
        const somethingWentWrongDuringTheCommunitcation =
          !!generatedResults.filter(item => item.response.httpStatus !== 200).length
        if(somethingWentWrongDuringTheCommunitcation){
          dataSent.failMessage += 'One of the http status of the responses was different than 200.|\n'
        }

        const badApiResponses = require('./validators/badApiResponses')(generatedResults)
        const weHaveBadResponses = !!badApiResponses.length
        if(weHaveBadResponses){
          dataSent.failMessage += 'At least one of the request has "bad" responses.|\n'
        }
        if(somethingWentWrongDuringTheCommunitcation){
          dataSent.failMessage += 'Some status-aggregator messages are "bad".|\n'
        }
        stat = !weHaveBadResponses && !somethingWentWrongDuringTheCommunitcation && validUrls && validApiResponses && !fail

        if(debug){
          op.set(dataSent,'debug.allTrueGoodResponse.status', stat)
          op.set(dataSent,'debug.allTrueGoodResponse.notWeHaveBadResponses', !weHaveBadResponses)
          op.set(dataSent,'debug.allTrueGoodResponse.notSomethingWentWrongDuringTheCommunitcation', !somethingWentWrongDuringTheCommunitcation)
          op.set(dataSent,'debug.allTrueGoodResponse.validUrls', validUrls)
          op.set(dataSent,'debug.allTrueGoodResponse.validApiResponses', validApiResponses)
          op.set(dataSent,'debug.allTrueGoodResponse.notFail', !fail)

          op.set(dataSent,'debug.parameters.timeout', requestTimeout)
          op.set(dataSent,'debug.parameters.fail', {fail,failMsg})
          op.set(dataSent,'debug.parameters.looseUrlCheck', looseUrlCheck)
          // if(weHaveBadResponses){
          op.set(dataSent,'debug.response.errors', apiGetterResults.errorObjects)
          // }
        }

      }
      const d = dataPatcher(dataSent, stat, timeSpan)
      d.generatedResults = generatedResults;
      resolve(d)
    })
  }

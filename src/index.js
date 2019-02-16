const dslFramework = require('dsl-framework').noPromoises()
  , apiGetter = require('./data-getters/status-aggregator')
  , flatten = require('array-flatten')
  , responseSenderAdapter = (isRresifyResponse) => {

  if(isRresifyResponse){
    return (res, data) => {
      res.json(200, data);
    }
  }
  if(!isRresifyResponse){
    return (res, data) => {
      res.status(200).json(data)
    }
  }
}
  , statusReport = (success = true) => (isRresifyResponse, timeSpan) =>
      (res, data) =>
        responseSenderAdapter(isRresifyResponse)
        (res, Object.assign(
          {
            status:success?'ok':'bad',
            timer:{
              durationMs: timeSpan()(),
              sent:new Date().toUTCString()
            },
            }, data))

module.exports= dslFramework(
  (e, parameters) => {
    const timeSpan = require('time-span');
    const apis = parameters.arguments('addApi', 'allEntries')
    let extraData = parameters.arguments('addExtraData', 'allEntries')
    extraData = !!extraData ? flatten(extraData) : false
    const res = parameters.arguments('addResponse', 'lastArgument')
    const isResifyResponse = parameters.command.has('resifyResponse')
    let requestTimeout = parameters.arguments('timeout', 'lastArgument')
    requestTimeout = requestTimeout ? requestTimeout : 1000
    // const fail = parameters.arguments('fail ', 'lastArgument')
    const fail = parameters.command.has('fail')
    const failMsg = parameters.arguments('fail', 'lastArgument')

    require('./validators/apis')(apis)

    return new Promise(async (resolve, reject) => {
      let status = !fail;
      let dataSent = {}
      if(extraData){
        dataSent.extraData = extraData
      }
      if(fail && failMsg){
        dataSent.failMessage = failMsg
      }
      let weDontHaveAnyApis = !!apis
      let generatedResults = []
      if (weDontHaveAnyApis) {
        const {results, msg}= await apiGetter(apis,requestTimeout).catch(e => l(e)())
        dataSent.msg = msg ? msg:undefined
        generatedResults = results
        const somethingWentWrongDuringTheCommunitcation =
          !!results.filter(item => item.status !== 200).length || !Object.keys(results).length
        const badApiResponses = require('./validators/badApiResponses')(results)
        const weHaveBadResponses = !!badApiResponses.length
        status = !weHaveBadResponses && !somethingWentWrongDuringTheCommunitcation && status
      }
      statusReport(status)(isResifyResponse, timeSpan)(res, dataSent)

      resolve(generatedResults)
    })
  }
)

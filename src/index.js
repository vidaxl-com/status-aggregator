const dslFramework = require('dsl-framework').noPromoises()
const apiGetter = require('./data-getters/status-aggregator')
const flatten = require('array-flatten')

const responseSenderAdapter = (isRresifyResponse) => {

  if(isRresifyResponse){
    return (res, data) => res.json(200, data);
  }
  if(!isRresifyResponse){
    return (res, data) => res.status(200).json(data)
  }
}
  , okStatus = (isRresifyResponse) =>
  (res, data) => responseSenderAdapter(isRresifyResponse)(res, Object.assign({status:'ok'}, data))
  , notOkStatus = (isRresifyResponse) =>
  (res, data) => responseSenderAdapter(isRresifyResponse)
    (res, Object.assign({status:'bad'}, data))

module.exports= dslFramework(
  (e, parameters) => {
    const apis = parameters.arguments('addApi', 'allEntries')
    let extraData = parameters.arguments('addExtraData', 'allEntries')
    extraData = !!extraData ? flatten(extraData) : false
    const res = parameters.arguments('addResponse', 'lastArgument')
    const isResifyResponse = parameters.command.has('resifyResponse')
    let requestTimeout = parameters.arguments('timeout', 'lastArgument')
    requestTimeout = requestTimeout ? requestTimeout : 1000
    require('./validators/apis')(apis)

    return new Promise(async (resolve, reject) => {
      let dataSent = {}
      if(extraData){
        dataSent.extraData = extraData
      }
      let weDontHaveAnyApis = !!apis
      let generatedResults = []
      if (weDontHaveAnyApis) {
        const {results, msg}= await apiGetter(apis,requestTimeout).catch(e => l(e)())
        generatedResults = results
        // l(Object.keys(results).length)()
        const somethingWentWrongDuringTheCommunitcation =
          !!results.filter(item => item.status !== 200).length || !Object.keys(results).length

        const allFine = !somethingWentWrongDuringTheCommunitcation
        if(allFine){
          let badApiResponses = []
          for (let i = 0; i < results.length; i++) {
            let actResult = results[i]
            if(actResult.data.status === 'bad'){
              badApiResponses.push(actResult)
            }
          }
          let weHaveBadResponses = !!badApiResponses.length
          if(weHaveBadResponses){
            notOkStatus(isResifyResponse)(res, dataSent)
          }
          if(!weHaveBadResponses){
            okStatus(isResifyResponse)(res, dataSent)
          }
        }
        if(!allFine){
          dataSent.msg = msg
          notOkStatus(isResifyResponse)(res, dataSent)
        }
      }
      if (!weDontHaveAnyApis) {
        okStatus(isResifyResponse)(res, dataSent)
      }
      resolve(generatedResults)
    })
  }
)



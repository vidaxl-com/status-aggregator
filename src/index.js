const dslFramework = require('dsl-framework').noPromoises()
const axios = require('axios')
const aFlatten = require('array-flatten')
const responseSenderAdapter = (isRresifyResponse) => {
  if(isRresifyResponse){
    return (res, data) => res.json(200, data);
  }
  if(!isRresifyResponse){
    return (res, data) => res.status(200).json(data)
  }
}
  , okStatus = (isRresifyResponse) =>
  (res) => responseSenderAdapter(isRresifyResponse)(res,{status:'ok'})
  , notOkStatus = (isRresifyResponse) =>
  (res, data) => responseSenderAdapter(isRresifyResponse)(res,Object.assign({status:'bad'}, data))

module.exports= dslFramework(
  (e, parameters) => {
    const apis = parameters.arguments('addApi', 'allEntries')
    const res = parameters.arguments('addResponse', 'lastArgument')
    const isResifyResponse = parameters.command.has('resifyResponse')

    require('./validators/apis')(apis)

    return new Promise(async (resolve, reject) => {
      let results = []
      let weHaveApis = !!apis
      let msg = ''

      if (weHaveApis) {
        apisFlattened = aFlatten(apis)
        for (let i = 0; i < apisFlattened.length; i++) {
          try{
            results.push(await axios.get(apisFlattened[i],{
              validateStatus: function (status) {
                return status >= 200 && status < 600; // default
              }
            }))
          }
          catch (e) {
            msg += `Connecting to ${e.request._currentUrl} was not successful \n`
          }
        }
        let somethingWentWrongDuringTheCommunitcation =
          !!results.filter(item => item.status !== 200).length || !Object.keys(results).length

        let allFine = !somethingWentWrongDuringTheCommunitcation
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
            notOkStatus(isResifyResponse)(res)
          }
          if(!weHaveBadResponses){
            okStatus(isResifyResponse)(res)
          }
        }
        if(!allFine){
          notOkStatus(isResifyResponse)(res, {msg})
        }
      }
      if (!weHaveApis) {
        okStatus(isResifyResponse)(res)
      }
      resolve(results)
    })
  }
)



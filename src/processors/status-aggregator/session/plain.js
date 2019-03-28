const datePatcher = require('../../../lib/date-pathcer')()
  , dataPatcher = (data, success = true, datePatcher) => {
  if(!data.failMessage){
    delete data.failMessage
  }
  let resultingData = Object.assign(
    data,
    {
      status:success?'ok':'bad',
    })
  return datePatcher(resultingData)

  return resultingData
}
  , op = require('object-path')

module.exports = (module, sessionModulePath, sessionToken) => {
  const returnObject = {}
  const weGotTheSameSession = op.get(module, sessionModulePath)
  if(weGotTheSameSession){
    returnObject.returnThis=new Promise(async (resolve, reject) => {
      let dataSent = {}
      dataSent.message = sessionToken + ' session token is already in use on this server.'
        + ' To avoid any memory leaks. This request will not fetch the details'
      const d = dataPatcher(dataSent, true, datePatcher)
      resolve(d)
    })
  }
  if(!weGotTheSameSession){
    op.set(module, sessionModulePath, true)
  }
  return returnObject
}

module.exports =  (data, success = true) => {
  const datePatcher = require('../../lib/date-pathcer')()
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

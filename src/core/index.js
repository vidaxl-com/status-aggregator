const flatten = require('array-flatten')
const sendStatusReport = async (res, resultingData, oldStyleRequest) =>
  new Promise((resolve, reject) =>{
    const {responseSend} = require('../sever-data-adapters/express-restify-adapter')(oldStyleRequest)
    responseSend(res, resultingData)
    resolve(resultingData)
  })
const jsUcfirst = (string) => string.charAt(0).toUpperCase() + string.slice(1)
const getDbResults = (dbType, parameters) => new Promise(async (resolve, reject) => {
  const result = await require('../processors/databases/base')
  (require(`../processors/databases/${dbType}`))
  (flatten(parameters.arguments(`add${jsUcfirst(dbType)}`, 'allEntries', [])))
  (parameters)

  resolve(result)
})

module.exports={
  sendStatusReport,
  getDbResults,
}

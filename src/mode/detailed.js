const op = require('object-path')
module.exports = (dependencies) => {
  const {parameters, resolveData,statusAggregatorResults,extraData,mysqlResults,
    mongoResults,couchdbResults,elasticResults} = dependencies

  let results = {}
  Object.assign(results, resolveData)

  results = Object.assign(resolveData, {statusAggregatorResults})

  if(extraData){
    results = Object.assign(resolveData,{extraData})
  }
  if(mysqlResults.results.length){
    results = Object.assign(resolveData,{mysqlResults})
  }
  if(mongoResults.results.length){
    results = Object.assign(resolveData,{mongoResults})
  }
  if(couchdbResults.results.length){
    results = Object.assign(resolveData,{couchdbResults})
  }
  if(elasticResults.results.length){
    results = Object.assign(resolveData,{elasticResults})
  }
  op.set(results, 'info.version.status-aggregator', require('../../package.json').version)

  const otherVersions = parameters.arguments('version')
  if(otherVersions) {
    otherVersions.forEach(entry => op.set(resolveData, `info.version.${entry[0]}`, `info.version.${entry[1]}`))
  }

  op.set(results, 'info.version.node', process.version)
  op.set(results, 'info.server.uptime', require('server-uptime'))

  return results
}

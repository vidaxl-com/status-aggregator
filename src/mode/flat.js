const op = require('object-path')
const flatten = require('flat')

module.exports = (dependencies) => {
  const {
    parameters, resolveData, statusAggregatorResults, extraData, mysqlResults,
    mongoResults, couchdbResults, elasticResults
  } = dependencies
  const detailed = require('./detailed')(dependencies)
  // l(flatten(detailed))()
  return flatten(detailed)
}

const flatten = require('flat')

module.exports = (dependencies) => {
  const {
    parameters, resolveData, statusAggregatorResults, extraData, dbResults
  } = dependencies
  const detailed = require('./detailed')(dependencies)
  return flatten(detailed)
}

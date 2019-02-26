const {expect} = require('chai')
  , assertLog = require('debug')('status-aggregator-test:assertLog:goodBad')
  , flat = require('flat')
  , op = require('object-path')

module.exports = (data, assertData) => {
  assertLog(`${data.data.status} === ${assertData}`)
  expect(data.data.status).to.equal(assertData)
  const statusAggregatorResults = data.data.statusAggregatorResults
  expect(statusAggregatorResults.status).to.equal(assertData)
  // const allStatuses = Object.keys(flat(data.data.statusAggregatorResults))
  //   .filter(path=>path.endsWith('.status'))
  //   .map(path=>op.get(statusAggregatorResults, path))
  // const assertTypeStatuses = allStatuses.filter(value => value === assertData)
  // const assertTypeOk = assertData === 'ok'
  // if(assertTypeOk){
  //   expect(allStatuses.length).to.equal(assertTypeStatuses.length)
  // }
  // if(!assertTypeOk){
  //   expect(allStatuses.length >= assertTypeStatuses.length).to.equal(true)
  // }
}

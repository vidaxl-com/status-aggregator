const {expect} = require('chai')
  , assertLog = require('debug')('status-aggregator-test:assertLog:goodBad')

module.exports = (data, assertData) => {
  assertLog(`${data.data.status} === ${assertData}`)
  expect(data.data.status).to.equal(assertData)
}

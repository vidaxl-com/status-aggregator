const {expect} = require('chai')
  , assertLog = require('debug')('status-aggregator-test:badGoodRt:assertLog')

module.exports = (data, assertData) => {
  expect(data.data.status).to.equal(assertData)
}

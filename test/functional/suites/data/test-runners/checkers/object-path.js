const {expect} = require('chai')
  , op = require('object-path')
  , assertLog = require('debug')('status-aggregator-test:assertLog:objectPath')

module.exports = (data, assertData) => {
  data = data.data
  assertData.forEach(testDataItem => {
    assertLog(`data on  path ${testDataItem.path} === ${testDataItem.value}`)
    expect(op.get(data, testDataItem.path)).to.equal(testDataItem.value)
  })
}

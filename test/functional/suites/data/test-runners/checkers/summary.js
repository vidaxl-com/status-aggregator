const {expect} = require('chai')
  , assertLog = require('debug')('status-aggregator-test:assertLog:summary')
  , flat = require('flat')
  , op = require('object-path')
module.exports = (data, assertData) => {
  assertData = parseInt(assertData)
  data = data.data
  const flatDataStatus = flat(data.errors.dataStatus)
  const flatServerStructure = flat(data.serverStructure)

  if(
    Array.isArray(assertData)
    &&
    assertData.includes('Two servers one fo them fails')
  ){
    expect(Object.keys(flatDataStatus).length).to.be.equal(1)
    expect(Object.keys(flatServerStructure).length).to.be.equal(2)
    expect(Object.keys(flatServerStructure).length).to.be.equal(2)
  }
}

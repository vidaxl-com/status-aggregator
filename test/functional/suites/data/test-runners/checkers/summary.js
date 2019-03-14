const {expect} = require('chai')
  , assertLog = require('debug')('status-aggregator-test:assertLog:summary')
  , flat = require('flat')
  , op = require('object-path')
module.exports = (data, assertData) => {
  assertData = parseInt(assertData)
  data = data.data
  // l(assertData,data,).lol.die()
  if(assertData === 1){}
  if(assertData === 2){
    l(assertData,data,).lol()
  }

  if(assertData === 3){
    const flatDataStatus = flat(data.errors.dataStatus)
    const flatServerStructure = flat(data.serverStructure)
    expect(Object.keys(flatDataStatus).length).to.be.equal(1)
    expect(Object.keys(flatServerStructure).length).to.be.equal(2)
    expect(Object.keys(flatServerStructure).length).to.be.equal(2)
  }
  //todo: make some meaningful tests
  // data = data.data
}

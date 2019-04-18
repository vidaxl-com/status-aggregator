// [require-a-lot] testIncludes begin
const {
  expect, //*tag* of chai | chai@4.2.0 | http://chaijs.com | BDD/TDD assertion library for node.js and the browser. T...
  debug, //debug@4.1.1 | https://github.com/visionmedia/debug#readme | small debugging utility
  op, //*alias* of object-path | object-path@0.11.4 | https://github.com/mariocasciaro/object-path | Access deep obje...
}
// [require-a-lot] testIncludes end
  = require('../../../../../requires')

const assertLog = debug('status-aggregator-test:assertLog:objectPath')

module.exports = (data, assertData) => {
  data = data.data
  assertData.forEach(testDataItem => {
    assertLog(`data on  path ${testDataItem.path} === ${testDataItem.value}`)
    expect(op.get(data, testDataItem.path)).to.equal(testDataItem.value)
  })
}

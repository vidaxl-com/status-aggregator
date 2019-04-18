// [require-a-lot] testIncludes begin
const {
  expect, //*tag* of chai | chai@4.2.0 | http://chaijs.com | BDD/TDD assertion library for node.js and the browser. T...
  flatten, //*alias* of flat | flat@4.1.0 | https://github.com/hughsk/flat | Take a nested Javascript object and flat...
}
// [require-a-lot] testIncludes end
  = require('../../../../../requires')

module.exports = (data, assertData) => {
  assertData = parseInt(assertData)
  data = data.data
  const flatDataStatus = flatten(data.errors.dataStatus)
  const flatServerStructure = flatten(data.serverStructure)

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

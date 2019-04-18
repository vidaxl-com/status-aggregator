// [require-a-lot] testIncludes begin
const {
  expect, //*tag* of chai | chai@4.2.0 | http://chaijs.com | BDD/TDD assertion library for node.js and the browser. T...
  debug, //debug@4.1.1 | https://github.com/visionmedia/debug#readme | small debugging utility
  flatten, //*alias* of flat | flat@4.1.0 | https://github.com/hughsk/flat | Take a nested Javascript object and flat...
  op, //*alias* of object-path | object-path@0.11.4 | https://github.com/mariocasciaro/object-path | Access deep obje...
}
// [require-a-lot] testIncludes end
  = require('../../../../../requires')

const assertLog = debug('status-aggregator-test:assertLog:goodBad')

module.exports = (data, assertData) => {
  assertLog(`${data.data.status} === ${assertData}`)
  expect(data.data.status).to.equal(assertData)
  const statusAggregatorResults = data.data.statusAggregatorResults
  expect(statusAggregatorResults.status).to.equal(assertData)
  const allStatuses = Object.keys(flatten(data.data.statusAggregatorResults))
    .filter(path=>(path.endsWith('.status')) && !path.includes('debug'))
    .map(path=>({result: op.get(statusAggregatorResults, path), path}))
  const assertTypeStatuses = allStatuses.filter(value => value.result === assertData)
  const assertTypeOk = assertData === 'ok'
  if(assertTypeOk){
    expect(allStatuses.length).to.equal(assertTypeStatuses.length)
  }
  if(!assertTypeOk){
    expect(allStatuses.length >= assertTypeStatuses.length).to.equal(true)
  }
}

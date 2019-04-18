// [require-a-lot] testIncludes begin
const {
  expect, //*tag* of chai | chai@4.2.0 | http://chaijs.com | BDD/TDD assertion library for node.js and the browser. T...
}
// [require-a-lot] testIncludes end
  = require('../../../../../requires')
module.exports = (data, assertData) => {
  // todo: Write all those tests here too!
  const workData = data.data
  expect(!!workData['info.version.node']).to.equal(true)
  expect(!!workData['statusAggregatorResults.generatedResults.1.' +
  'data.statusAggregatorResults.generatedResults.2.data.name']).to.equal(true)
  expect(!!workData['statusAggregatorResults.generatedResults.1.' +
  'data.statusAggregatorResults.generatedResults.0.' +
  'data.statusAggregatorResults.generatedResults.0.' +
  'data.statusAggregatorResults.generatedResults.1.request.url.used']).to.equal(true)
}

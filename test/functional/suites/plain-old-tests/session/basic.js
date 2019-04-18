// [require-a-lot] testIncludes begin
const {
  axios, //axios@0.18.0 | https://github.com/axios/axios | Promise based HTTP client for the browser and node.js
  expect, //*tag* of chai | chai@4.2.0 | http://chaijs.com | BDD/TDD assertion library for node.js and the browser. T...
  op, //*alias* of object-path | object-path@0.11.4 | https://github.com/mariocasciaro/object-path | Access deep obje...
}
// [require-a-lot] testIncludes end
  = require('../../../../requires')

module.exports =  describe('basic', ()=> {
  it('test', async ()=>{
    const servers = await require('./servers/basic')()
    const data = await axios.get(servers[2].getStatusUrl(),{timeout:500})
    expect(data.data.status).to.equal('ok')
    expect(op.get(data.data, 'statusAggregatorResults.generatedResults.0.request.url.used').includes('?session')).to.equal(true)

    const responseData = data.data
    const checkers = require('./lib/checkers')(responseData)
    checkers.numberOfSessionTokens(2, `there shall be ${2} tokens`)
    checkers.numberOfUniqueSessionTokens(1,`there shall be ${1} unique token`)

    servers.stop()
  })
})

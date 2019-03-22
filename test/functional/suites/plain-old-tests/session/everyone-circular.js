// [require-a-lot] sessionTestIncludes begin
const {
  axios, //axios@0.18.0 | https://github.com/axios/axios | Promise based HTTP client for the browser and node.js
  expect, //*tag* of chai | chai@4.2.0 | http://chaijs.com | BDD/TDD assertion library for node.js and the browser. T...
  op, //*alias* of object-path | object-path@0.11.4 | https://github.com/mariocasciaro/object-path | Access deep obje...
}  
// [require-a-lot] sessionTestIncludes end
  = require('../lib/requires')

module.exports =  describe('circular depencencies', ()=> {
  it('test', async ()=>{
    //todo: check if all server gave feedback
    const servers = await require('./servers/everyone-circular')()
    const data = await axios.get(servers[5].getStatusUrl(),{timeout:500})
    expect(data.data.status).to.equal('ok')
    expect(op.get(data.data, 'statusAggregatorResults.generatedResults.0.request.url.used').includes('?session')).to.equal(true)

    const responseData = data.data
    const checkers = require('./lib/checkers')(responseData)

    checkers.numberOfSessionTokens(30, `circular tokens`)
    checkers.numberOfUniqueSessionTokens(1,`circular unique tokens`)
    // checkers.numberOfNames(33)
    checkers.numberOfUniqueNames(6)
    servers.stopAll()
  })
})

// [require-a-lot] testIncludes begin
const {
  axios, //axios@0.18.0 | https://github.com/axios/axios | Promise based HTTP client for the browser and node.js
  expect, //*tag* of chai | chai@4.2.0 | http://chaijs.com | BDD/TDD assertion library for node.js and the browser. T...
  flatten, //*alias* of flat | flat@4.1.0 | https://github.com/hughsk/flat | Take a nested Javascript object and flat...
  op, //*alias* of object-path | object-path@0.11.4 | https://github.com/mariocasciaro/object-path | Access deep obje...
}
// [require-a-lot] testIncludes end
  = require('../../../../requires')

module.exports =  describe('testig sessions', ()=> {
  it('session variables checking', async ()=>{
    //todo: check if all server gave feedback
    const servers = await require('./servers/more-backward-depenencies')()
    const data = await axios.get(servers[2].getStatusUrl(),{timeout:500})
    // l(data.data).lol(
    expect(data.data.status).to.equal('ok')
    expect(op.get(data.data, 'statusAggregatorResults.generatedResults.0.request.url.used').includes('?session')).to.equal(true)

    const responseData = data.data
    let flatData = flatten(responseData)
    const sessionTokens = Object.keys(flatData).filter(path => path.endsWith('request.url.used'))
      .map(path=>op.get(responseData, path))
      .map(url=>url.slice(url.indexOf('=')+1,url.length))
    expect(sessionTokens.length).to.equal(2)
    expect(sessionTokens[0]).to.equal(sessionTokens[1])

    servers.stop()
  })
})

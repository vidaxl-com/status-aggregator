l()
// [require-a-lot] sessionTestIncludes begin
const {
  axios, //axios@0.18.0 | https://github.com/axios/axios | Promise based HTTP client for the browser and node.js
  expect, //*tag* of chai | chai@4.2.0 | http://chaijs.com | BDD/TDD assertion library for node.js and the browser. T...
  serverStarter, //reative path: ../../../test-services/serverStarter
  statusAggregator,
  op, //*alias* of object-path | object-path@0.11.4 | https://github.com/mariocasciaro/object-path | Access deep obje...
  flatten, //*alias* of flat | flat@4.1.0 | https://github.com/hughsk/flat | Take a nested Javascript object and flat...
}
// [require-a-lot] sessionTestIncludes end
  = require('./../lib/requires')

module.exports =  describe('testig rateLimiting', ()=> {
  it('session variables checking', async ()=>{
    const server0 = await serverStarter.handler(
      (req,res)=>{
        statusAggregator
          .addResponse(res)
          .mockId('a')
          .request(req)()
      }
    ).name('success 0')()
    const server01 = await serverStarter.handler(
      (req,res)=>{
        statusAggregator
          .addResponse(res)
          .addApi(server0.getStatusUrl())
          .mockId('b')
          .request(req)()
      }
    ).name('success 01')()
    const server =

      await serverStarter.handler((req,res)=>{
        statusAggregator
          .addApi(server01.getStatusUrl())
          .addResponse(res)
          .mockId('c')
          .request(req)()
      })
        .name('server')()
    const data = await axios.get(server.getStatusUrl(),{timeout:500})
    expect(data.data.status).to.equal('ok')
    expect(op.get(data.data, 'statusAggregatorResults.generatedResults.0.request.url.used').includes('?session')).to.equal(true)

    const responseData = data.data
    let flatData = flatten(responseData)
    const sessionTokens = Object.keys(flatData).filter(path => path.endsWith('request.url.used'))
      .map(path=>op.get(responseData, path))
      .map(url=>url.slice(url.indexOf('=')+1,url.length))
    expect(sessionTokens.length).to.equal(2)
    expect(sessionTokens[0]).to.equal(sessionTokens[1])

    server01.stop()
    server0.stop()
    server.stop()
  })
})

// [require-a-lot] testIncludes begin
const {
  serverStarter, //reative path: ./functional/test-services/serverStarter
  emptySuccessService, //reative path: ./functional/test-services/handlers/empty-success-service
  emptyFailureService, //reative path: ./functional/test-services/handlers/empty-failure-service
  axios, //axios@0.18.0 | https://github.com/axios/axios | Promise based HTTP client for the browser and node.js
  expect, //*tag* of chai | chai@4.2.0 | http://chaijs.com | BDD/TDD assertion library for node.js and the browser. T...
  statusAggregator,
  nonExistingFailureService, //reative path: ./functional/test-services/handlers/non-existing-failure-service
}
// [require-a-lot] testIncludes end
  = require('../../../requires')

module.exports =  describe('basic behaviour without deep nested structures', ()=> {
  it('successful request', async () => {
    const server = await serverStarter.handler(emptySuccessService()()()).name('success')()
    const data = await axios.get(server.getStatusUrl())
    expect(data.data.statusAggregatorResults.status).to.equal('ok')
    expect(data.data.status).to.equal('ok')
    server.stop()
  })

  it('failed request', async () => {
    const server = await serverStarter.handler(emptyFailureService()()()).name('fail')()
    const data = await axios.get(server.getStatusUrl())
    expect(data.data.statusAggregatorResults.status).to.equal('bad')
    expect(data.data.status).to.equal('bad')
    server.stop()
  })

  it('non existing server', async () => {
    const server = await serverStarter
      .handler(nonExistingFailureService(2)).name('dependency does not exists')()
    const data = await axios.get(server.getStatusUrl())
    expect(data.data.statusAggregatorResults.status).to.equal('bad')
    expect(!!data.data.statusAggregatorResults.failMessage).to.equal(true)
    expect(data.data.statusAggregatorResults.failMessage.includes(' was not successful')).to.equal(true)
    expect(data.data.statusAggregatorResults.failMessage.includes('Connecting to http://localhost:')).to.equal(true)

    server.stop()
  })

  it('extraData server', async () => {
    const server = await serverStarter
      .handler(emptySuccessService()().extraParameters({addExtraData: ['yeah', 'no']})())
      .name('extraDataServer')()
    const data = await axios.get(server.getStatusUrl())
    expect(data.data.extraData[0]).to.equal('yeah')
    expect(data.data.extraData[1]).to.equal('no')
    server.stop()
  })

  it('User caused Fail', async () => {
    const server = await serverStarter
      .handler(emptySuccessService()().extraParameters({fail: ['I wanted to Fail It']})())
      .name('extraDataServer')()
    const data = await axios.get(server.getStatusUrl())
    expect(data.data.statusAggregatorResults.status).to.equal('bad')

    //todo: test fail message
    // expect(data.data.extraData[0]).to.equal('yeah')
    // expect(data.data.extraData[1]).to.equal('no')
    server.stop()
  })

  it('Tests name prarameter', async () => {
    let handler = (req, res) => {
      statusAggregator.addResponse(res).name('my-awesome-server')()
    }

    const server = await serverStarter
      .handler(handler)
      .name('name parameter test')()

    const data = await axios.get(server.getStatusUrl())
    expect(data.data.name).to.equal('my-awesome-server');
    server.stop()
  })
})

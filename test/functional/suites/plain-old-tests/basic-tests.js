const axios = require('axios')
  , {expect} = require('chai')
  , serverStarter = require('../../test-services/serverStarter')
  , emptySuccessHandler = require('../../test-services/handlers/empty-success-service')
  , emptyfailureHandler = require('../../test-services/handlers/empty-failure-service')
  , nonExistingfailureHandler = require('../../test-services/handlers/non-existing-failure-service')
  , assert = require('assert')
  , extractNumbers = require('extract-numbers')
  , statusGenerator = require('../../../../src')
  , op = require('object-path')
  , flatten = require('flat')

module.exports =  describe('basic behaviour without deep nested structures', ()=> {
  it('successful request', async () => {
    const server = await serverStarter.handler(emptySuccessHandler()()()).name('success')()
    const data = await axios.get(server.getStatusUrl())
    expect(data.data.statusAggregatorResults.status).to.equal('ok')
    expect(data.data.status).to.equal('ok')
    server.stop()
  })

  it('failed request', async () => {
    const server = await serverStarter.handler(emptyfailureHandler()()()).name('fail')()
    const data = await axios.get(server.getStatusUrl())
    expect(data.data.statusAggregatorResults.status).to.equal('bad')
    expect(data.data.status).to.equal('bad')
    server.stop()
  })

  it('non existing server', async () => {
    const server = await serverStarter
      .handler(nonExistingfailureHandler(2)).name('dependency does not exists')()
    const data = await axios.get(server.getStatusUrl())
    expect(data.data.statusAggregatorResults.status).to.equal('bad')
    expect(!!data.data.statusAggregatorResults.failMessage).to.equal(true)
    expect(data.data.statusAggregatorResults.failMessage.includes(' was not successful')).to.equal(true)
    expect(data.data.statusAggregatorResults.failMessage.includes('Connecting to http://localhost:')).to.equal(true)

    //todo: do it differently
    // l(extractNumbers(data.data.statusAggregatorResults.failMessage),data.data.statusAggregatorResults.failMessage).die()
    // assert(extractNumbers(data.data.statusAggregatorResults.failMessage).length === 3)
    server.stop()
  })

  it('extraData server', async () => {
    const server = await serverStarter
      .handler(emptySuccessHandler()().extraParameters({addExtraData: ['yeah', 'no']})())
      .name('extraDataServer')()
    const data = await axios.get(server.getStatusUrl())
    expect(data.data.extraData[0]).to.equal('yeah')
    expect(data.data.extraData[1]).to.equal('no')
    server.stop()
  })

  it('User caused Fail', async () => {
    const server = await serverStarter
      .handler(emptySuccessHandler()().extraParameters({fail: ['I wanted to Fail It']})())
      .name('extraDataServer')()
    const data = await axios.get(server.getStatusUrl())
    expect(data.data.statusAggregatorResults.status).to.equal('bad')

    //todo: test fail message
    // l(data.data).die()
    // expect(data.data.extraData[0]).to.equal('yeah')
    // expect(data.data.extraData[1]).to.equal('no')
    server.stop()
  })

  it('Tests name prarameter', async () => {
    let handler = (req, res) => {
      statusGenerator.addResponse(res).name('my-awesome-server')()
    }

    const server = await serverStarter
      .handler(handler)
      .name('name parameter test')()

    const data = await axios.get(server.getStatusUrl())
    expect(data.data.name).to.equal('my-awesome-server');
    server.stop()
  })
})

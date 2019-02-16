const axios = require('axios')
  , {expect} = require('chai')
  , serverStarter = require('../../test-services/serverStarter')
  , emptySuccessHandler = require('../../test-services/handlers/empty-success-service')
  , emptyfailureHandler = require('../../test-services/handlers/empty-failure-service')
  , nonExistingfailureHandler = require('../../test-services/handlers/non-existing-failure-service')
  , assert = require('assert')
  , extractNumbers = require('extract-numbers')

module.exports =   describe('Plain-server suite', ()=>{

  it('successful request', async ()=>{
    const server = await serverStarter.handler(emptySuccessHandler()).name('success')()
    const data = await axios.get(server.getStatusUrl())
    expect(data.data.status).to.equal('ok')
    server.stop()
  })

  it('failed request', async ()=>{
    const server = await serverStarter.handler(emptyfailureHandler()).name('fail')()
    const data = await axios.get(server.getStatusUrl())
    expect(data.data.status).to.equal('bad')
    server.stop()
  })

  it('non existing server', async ()=>{
    const server = await serverStarter
      .handler(nonExistingfailureHandler(2)).name('dependency does not exists')()
    const data = await axios.get(server.getStatusUrl())
    expect(data.data.status).to.equal('bad')
    expect(!!data.data.msg).to.equal(true)
    expect(data.data.msg.includes(' was not successful')).to.equal(true)
    expect(data.data.msg.includes('Connecting to http://localhost:')).to.equal(true)
    assert(extractNumbers(data.data.msg).length === 2)
    server.stop()
  })

  it('extraData server', async ()=>{
    const server = await serverStarter
      .handler(emptySuccessHandler({addExtraData:['yeah','no']}))
      .name('extraDataServer')()
    const data = await axios.get(server.getStatusUrl())
    expect(data.data.extraData[0]).to.equal('yeah')
    expect(data.data.extraData[1]).to.equal('no')
    server.stop()
  })

  it('User caused Fail', async ()=>{
    const server = await serverStarter
      .handler(emptySuccessHandler({fail:['I wanted to Fail It']}))
      .name('extraDataServer')()
    const data = await axios.get(server.getStatusUrl())
    expect(data.data.status).to.equal('bad')

    //todo: test fail message
    // l(data.data).die()
    // expect(data.data.extraData[0]).to.equal('yeah')
    // expect(data.data.extraData[1]).to.equal('no')
    server.stop()
  })

  it('Testing promise data', async ()=>{

    const statusGenerator = require('../../../../src/index')
    let retpromiseData = false
    let handler = (req, res) => {
      statusGenerator.addResponse(res)()
        .then(
          data=>{
            retpromiseData = data
          })
    }

    const server = await serverStarter
      .handler(handler)
      .name('promise handler test server')()
    const data = await axios.get(server.getStatusUrl())
    expect(retpromiseData).to.deep.equal(data.data);
    server.stop()
  })

})

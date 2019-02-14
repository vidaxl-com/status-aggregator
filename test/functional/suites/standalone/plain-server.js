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
    const server = await serverStarter.handler(emptySuccessHandler).name('success')()
    const data = await axios.get(server.getStatusUrl())
    expect(data.data.status).to.equal('ok')
    server.stop()
  })

  it('failed request', async ()=>{
    const server = await serverStarter.handler(emptyfailureHandler).name('fail')()
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
})

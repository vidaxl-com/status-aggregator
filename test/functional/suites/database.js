const axios = require('axios')
  , {expect} = require('chai')
  , serverStarter = require('../test-services/serverStarter')
  , emptySuccessHandler = require('../test-services/handlers/empty-success-service')
  , emptyfailureHandler = require('../test-services/handlers/empty-failure-service')
  , nonExistingfailureHandler = require('../test-services/handlers/non-existing-failure-service')
  , assert = require('assert')
  , extractNumbers = require('extract-numbers')
  , statusGenerator = require('../../../src/index')

module.exports =  describe('Database suite', ()=>{

  it('successful connection to mysql', async ()=>{
    const server = await serverStarter.handler((req,res)=>{
      statusGenerator.addMysql({
        host     : 'localhost',
        user     : 'user',
        password : 'password',
        connectTimeout: 200
      }).addResponse(res)
      ()
    }).name('successDatabase')()
    const data = await axios.get(server.getStatusUrl())
    expect(data.data.mysqlResults.results[0].status).to.equal('ok')
    expect(data.data.mysqlResults.status).to.equal('ok')
    server.stop()
  })

  it('failed connection to mysql', async ()=>{
    const server = await serverStarter.handler((req,res)=>{
      statusGenerator.addMysql({
        host     : 'localhost',
        user     : 'user',
        password : 'passwordWrong',
        connectTimeout: 200
      }).addResponse(res)
      ()
    }).name('successDatabase')()
    const data = await axios.get(server.getStatusUrl())
    expect(data.data.mysqlResults.results[0].status).to.equal('bad')
    expect(data.data.mysqlResults.status).to.equal('bad')
    expect(data.data.status).to.equal('bad')
    server.stop()
  })
  // it('failed request', async ()=>{
  //   const server = await serverStarter.handler(emptyfailureHandler()).name('fail')()
  //   const data = await axios.get(server.getStatusUrl())
  //   expect(data.data.statusAggregatorResults.status).to.equal('bad')
  //   expect(data.data.status).to.equal('bad')
  //   server.stop()
  // })
  //
  // it('non existing server', async ()=>{
  //   const server = await serverStarter
  //     .handler(nonExistingfailureHandler(2)).name('dependency does not exists')()
  //   const data = await axios.get(server.getStatusUrl())
  //   expect(data.data.statusAggregatorResults.status).to.equal('bad')
  //   expect(!!data.data.statusAggregatorResults.msg).to.equal(true)
  //   expect(data.data.statusAggregatorResults.msg.includes(' was not successful')).to.equal(true)
  //   expect(data.data.statusAggregatorResults.msg.includes('Connecting to http://localhost:')).to.equal(true)
  //   assert(extractNumbers(data.data.statusAggregatorResults.msg).length === 2)
  //   server.stop()
  // })
})

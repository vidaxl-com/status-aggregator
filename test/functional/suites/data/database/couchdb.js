const axios = require('axios')
  , {expect} = require('chai')
  , serverStarter = require('../../../test-services/serverStarter')
  , statusGenerator = require('../../../../../src')

jsUcfirst = (string) => string.charAt(0).toUpperCase() + string.slice(1)

module.exports =  describe('couchdb', ()=>{
  it('successful connection', async ()=>{
    const server = await serverStarter.handler((req,res)=>{
      statusGenerator.addCouchdb('http://localhost:5984').addResponse(res)
      ()
    }).name('successDatabase')()
    const data = await axios.get(server.getStatusUrl())
    expect(data.data.couchdbResults.results[0].status).to.equal('ok')
    expect(data.data.couchdbResults.status).to.equal('ok')

    server.stop()
  })

  it('failed connection', async ()=>{
    const server = await serverStarter.handler((req,res)=>{
      statusGenerator.addCouchdb('http://localhost:5985').addResponse(res)
      ()
    }).name('successDatabase')()
    const data = await axios.get(server.getStatusUrl())
    expect(data.data.couchdbResults.results[0].status).to.equal('bad')
    expect(data.data.couchdbResults.status).to.equal('bad')

    server.stop()
  })

})

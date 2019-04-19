const axios = require('axios')
  , {expect} = require('chai')
  , serverStarter = require('../../../test-services/server-starter')

module.exports =  describe('elasticSearch', ()=>{

  it('successful connection', async ()=>{
    const server = await serverStarter.handler((req,res)=>{
      statusAggregator.addElastic({host: '0.0.0.0:9200'}).addResponse(res)
      ()
    }).name('successDatabase')()
    const data = await axios.get(server.getStatusUrl())
    expect(data.data.elasticResults.results[0].status).to.equal('ok')
    expect(data.data.elasticResults.status).to.equal('ok')
    server.stop()
  })

})


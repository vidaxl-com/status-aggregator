const axios = require('axios')
  , {expect} = require('chai')
  , serverStarter = require('../../../test-services/serverStarter')
  , statusGenerator = require('../../../../../src')

module.exports =  describe('Database suite', ()=>{
  describe('mongo', ()=>{

    it('successful connection', async ()=>{
      const server = await serverStarter.handler((req,res)=>{
        statusGenerator.addMongo('mongodb://localhost:27017').addResponse(res)
        ()
      }).name('successDatabase')()
      const data = await axios.get(server.getStatusUrl())
      expect(data.data.mongoResults.results[0].status).to.equal('ok')
      expect(data.data.mongoResults.status).to.equal('ok')
      server.stop()
    })

    it('failed connection', async ()=>{
      const server = await serverStarter.handler((req,res)=>{
        statusGenerator.addMongo('mongodb://localhost:27016').addResponse(res)
        ()
      }).name('successDatabase')()
      const data = await axios.get(server.getStatusUrl())
      expect(data.data.mongoResults.results[0].status).to.equal('bad')
      expect(data.data.mongoResults.status).to.equal('bad')
      server.stop()
    })

  })
})

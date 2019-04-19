const axios = require('axios')
  , {expect} = require('chai')
  , serverStarter = require('../../../test-services/server-starter')

module.exports = describe('mysql', ()=>{
    it('successful connection to mysql', async ()=>{
      const server = await serverStarter.handler((req,res)=>{
        statusAggregator.addMysql({
          host     : '0.0.0.0',
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
        statusAggregator.addMysql({
          host     : '0.0.0.0',
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
  })

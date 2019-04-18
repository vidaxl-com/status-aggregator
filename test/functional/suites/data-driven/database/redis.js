const axios = require('axios')
    , {expect} = require('chai')
    , serverStarter = require('../../../test-services/serverStarter')
    , statusGenerator = require('../../../../../src')

module.exports =  describe('redis', ()=>{

    it('successful connection', async ()=>{
        const server = await serverStarter.handler((req,res)=>{
            statusAggregator.addRedis({
                host     : '0.0.0.0',
                port     : '6379'
            }).addResponse(res)
            ()
        }).name('successDatabase')()
        const data = await axios.get(server.getStatusUrl())
        expect(data.data.redisResults.results[0].status).to.equal('ok')
        expect(data.data.redisResults.status).to.equal('ok')
        server.stop()
    })

    it('failed connection', async ()=>{
        const server = await serverStarter.handler((req,res)=>{
            statusAggregator.addRedis({
                host     : '0.0.0.0',
                port     : '6380'
            }).addResponse(res)
            ()
        }).name('successDatabase')()
        const data = await axios.get(server.getStatusUrl())
        expect(data.data.redisResults.results[0].status).to.equal('bad')
        expect(data.data.redisResults.status).to.equal('bad')
        server.stop()
    })

})

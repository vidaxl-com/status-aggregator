const statusGenerator = require('../../../src')
  , axios = require('axios')
  , {expect} = require('chai')
  , serverStarter = require('../test-services/serverStarter')
  , assertLog = require('debug')('status-aggregator-test:badGoodRt:assertLog')

module.exports = (name, serviceHandlers, assertData) =>{
  // l(name, serviceHandlers, assertData)()
  it(`${name}`, async ()=>{
    let servers = await require('./more-flat-server-starter')(serverStarter, statusGenerator, serviceHandlers)
    const data = await axios.get(servers.serverN.getStatusUrl())
    if(!!assertData){
      assertLog(`" - ${data.data.status}" === "${assertData}" - `)
      // l(data.data, "FFFFUUUU")()
      expect(data.data.status).to.equal(assertData)
      // l(data.data.status, assertData, "GGGs")()
      // expect(data.data.status).to.equal('bad')
      // expect(data.data.status).to.equal('ok')
    }
    servers.stop()
  })
}

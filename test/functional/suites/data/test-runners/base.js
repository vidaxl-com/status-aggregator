const statusGenerator = require('../../../../../src')
  , axios = require('axios')
  , serverStarter = require('../../../test-services/serverStarter')

module.exports = (name, serviceHandlers, assertData, checker = 'goodBad') =>{
  checker = require(`./checkers/${checker}`)
  it(`${name}`, async ()=>{
    let servers = await require('./more-flat-server-starter')(serverStarter, statusGenerator, serviceHandlers)
    const data = await axios.get(servers.serverN.getStatusUrl())
      checker(data, assertData)
    servers.stop()
  })
}

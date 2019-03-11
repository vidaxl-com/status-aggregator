const statusGenerator = require('../../../../../src')
  , axios = require('axios')
  , serverStarter = require('../../../test-services/serverStarter')
  , decamelize = require('decamelize')
  , op = require('object-path')


module.exports = (name, serviceHandlers, assertData, extraData, checker = 'goodBad', addRequestToServerN) =>{
  const validator = require(`./checkers/${decamelize(checker,'-')}`)
  it(`${name}`, async ()=>{
    let servers = await require('./more-flat-server-starter')(serverStarter, statusGenerator, serviceHandlers, [], addRequestToServerN)
    let url = servers.serverN.getStatusUrl()
    let extraGet = op.get(extraData, `${checker}.get`)
    if(extraGet){
      url += '?'
      Object.keys(extraGet).forEach(keyName=>url += keyName + '=' + extraGet[keyName])
    }
    const data = await axios.get(url)
    validator(data, assertData)
    servers.stop()
  })
}

// [require-a-lot] testIncludes begin
const {
  serverStarter, //reative path: ./functional/test-services/serverStarter
  decamelize, //decamelize@3.2.0 | https://github.com/sindresorhus/decamelize#readme | Convert a camelized string int...
  axios, //axios@0.18.0 | https://github.com/axios/axios | Promise based HTTP client for the browser and node.js
  op, //*alias* of object-path | object-path@0.11.4 | https://github.com/mariocasciaro/object-path | Access deep obje...
  statusAggregator,
}
// [require-a-lot] testIncludes end
  = require('../../../../requires')
module.exports = (name, serviceHandlers, assertData, extraData, checker = 'goodBad', addRequestToServerN) =>{
  const validator = require(`./checkers/${decamelize(checker,'-')}`)
  it(`${name}`, async ()=>{
    let servers = await require('./more-flat-server-starter')(serverStarter, statusAggregator, serviceHandlers, [], addRequestToServerN)
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

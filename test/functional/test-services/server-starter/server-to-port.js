// [require-a-lot] testIncludes begin
const {
  debug, //debug@4.1.1 | https://github.com/visionmedia/debug#readme | small debugging utility
  portscanner, //portscanner@2.2.0 | https://github.com/baalexander/node-portscanner | Asynchronous port scanner for ...
}
// [require-a-lot] testIncludes end
  = require('../../../requires')

const serverShutdownLog = debug('status-aggregator-test:serverShutdown')
const serverStartupLog = debug('status-aggregator-test:serverStartup')

module.exports = (name,host,portFrom,portTo,handler, statusUrlPeice,serverCreatedCounter) =>
new Promise(async (resolve, reject) => {
  const returnObject = {}
  const app = require('../new-app')()
  app.get(statusUrlPeice, handler)
  const port = await portscanner.findAPortNotInUse(portFrom, portTo).then(function(port) {
    return port
  })
  returnObject['name'] = name
  returnObject['host'] = host
  returnObject['port'] = port
  returnObject['statusUrlPeice'] = statusUrlPeice
  returnObject['getBaseUrlWithoutProtocoll'] = function(){ return this.host + ':' + this.port }
  returnObject['getBaseUrl'] = function(){ return this.protocoll + this.getBaseUrlWithoutProtocoll() }
  returnObject['getStatusUrl'] = function(){ return `${this.getBaseUrl()}${this.statusUrlPeice}`  }
  returnObject['protocoll'] = 'http://'
  returnObject['serverIdentifier'] = function(){ return `server "${returnObject.name}"; port: ${returnObject.port};`}
  returnObject['stop'] = function () {
    serverShutdownLog(`${returnObject.serverIdentifier()} stopped.`)
    this.server.close()
  }
  serverStartupLog(`${returnObject.serverIdentifier()} started.`)
  serverCreatedCounter()
  // l('aaa').lol()
  returnObject['server'] = app.listen(port, resolve(returnObject))
})

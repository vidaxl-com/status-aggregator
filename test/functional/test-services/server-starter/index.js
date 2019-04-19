// [require-a-lot] testIncludes begin
const {
  dslFramework,
  portscanner, //portscanner@2.2.0 | https://github.com/baalexander/node-portscanner | Asynchronous port scanner for ...
}
// [require-a-lot] testIncludes end
  = require('../../../requires')


const serverShutdownLog = require('debug')('status-aggregator-test:serverShutdown')
const serverStartupLog = require('debug')('status-aggregator-test:serverStartup')

const defaultHandler = function (req, res) {
  res.send('Hello World')
}

let serversCreated = 0

process.on('exit', (code) => {
  console.log(`${serversCreated} servers created during the tests.`);
});

module.exports = dslFramework(
  (e, parameters) => {
    let handler = parameters.arguments('handler','lastArgument')
    handler = !!handler ? handler : defaultHandler

    let host = parameters.arguments('host','lastArgument')
    host = !!host ? host : 'localhost'

    let name = parameters.arguments('name','lastArgument')
    if(!name) {
     name = `undefined-name-${require('random-string')({length: 5})}`
    }

    let statusUrlPeice = parameters.arguments('statusUrlPeice','lastArgument')
    statusUrlPeice = !!statusUrlPeice ? statusUrlPeice : '/status'

    let portFrom = parameters.arguments('portFrom','lastArgument')
    portFrom = !!portFrom ? portFrom : 3000

    let portTo = parameters.arguments('portTo','lastArgument')
    portTo = !!portTo ? portTo : 4000

    const returnObject = {}

    const actualNumberOfServers = parameters.arguments('actualNumberOfServers','lastArgument', 1)
    const server = actualNumberOfServers <= 1?(()=>
        new Promise(async (resolve, reject) => {
          const app = require('./new-app')()

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
          serversCreated++
          returnObject['server'] = app.listen(port, resolve(returnObject))
        })
    )():null
    return server
  }
)

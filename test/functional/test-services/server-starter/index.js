const defaultHandler = function (req, res) {
  res.send('Hello World')
}

let serversCreated = 0
const serverCreatedCounter = ()=> ++serversCreated

process.on('exit', (code) => {
  console.log(`${serversCreated} servers created during the tests.`);
});

module.exports = require('dsl-framework')()(
  (e, parameters) => {
    const handler = parameters.arguments('handler','lastArgument', defaultHandler)
      , host = parameters.arguments('host','lastArgument', 'localhost')
      , name = parameters.arguments('name','lastArgument', `undefined-name-${require('random-string')({length: 5})}`)
      , statusUrlPeice = parameters.arguments('statusUrlPeice','lastArgument', '/status')
      , portFrom = parameters.arguments('portFrom','lastArgument', 3000)
      , portTo = parameters.arguments('portTo','lastArgument', 4000)

    const actualNumberOfServers = parameters.arguments('actualNumberOfServers','lastArgument', 1)
    const server = actualNumberOfServers <= 1?(()=>
        require('./server-to-port')(name,host,portFrom,portTo,handler,statusUrlPeice,serverCreatedCounter)
    )():null
    return server
  }
)

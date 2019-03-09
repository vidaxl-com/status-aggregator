require('cowlog')()
  const serverStructures = require('./suites/data/server-structures')
  , suiteRunner = require('./suites/data/suite-runner')

describe('Functional Tests', ()=>{
  require('./suites/plain-server')
  // require('./suites/plain-server1')
  suiteRunner('good/Bad request evaluation suite', serverStructures, 'goodBad')
  suiteRunner('deep object-path evaluation suite', serverStructures, 'objectPath')
  suiteRunner('summary evaluation suite', serverStructures, 'summary')
  require('./suites/data/database')
})


require('cowlog')()
  const serverStructures = require('./suites/data/server-structures')
  , suiteRunner = require('./suites/data/suite-runner')

describe('Functional Tests', ()=>{
  require('./suites/plain-server')
  require('./suites/database')
  suiteRunner('Good/Bad request evaluation suite', serverStructures, 'goodBad')
  suiteRunner('deep object-path evaluation suite', serverStructures, 'objectPath')
})


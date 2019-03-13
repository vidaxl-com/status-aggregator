  const serverStructures = require('./suites/data/server-structures')
  , suiteRunner = require('./suites/data/suite-runner')

describe('Functional Tests', ()=>{
  require('./suites/data/database')
  require('./suites/plain-server')
  suiteRunner('good/Bad request evaluation suite', serverStructures, 'goodBad')
  suiteRunner('deep object-path evaluation suite', serverStructures, 'objectPath')
  suiteRunner('summary evaluation suite', serverStructures, 'summary')
  suiteRunner('flat evaluation suite', serverStructures, 'flat')
})


  const serverStructures = require('./suites/data-driven/server-structures')
  , suiteRunner = require('./suites/data-driven/suite-runner')

describe('Functional Tests', ()=>{
  require('./suites/data-driven/database')
  require('./suites/plain-old-tests')
  suiteRunner('good/Bad request evaluation suite', serverStructures, 'goodBad')
  suiteRunner('deep object-path evaluation suite', serverStructures, 'objectPath')
  suiteRunner('flat evaluation suite', serverStructures, 'flat')
  suiteRunner('summary evaluation suite', serverStructures, 'summary')
})


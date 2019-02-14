process.env.DEBUG = ' express:, status-aggregator-test:*'
  const serverStructures = require('./suites/data/server-structures')
  , suiteRunner = require('./suites/data/suiter-runner')

describe('Functional Tests', ()=>{
  require('./suites/standalone/plain-server')
  suiteRunner('Good/Bad request evaluation suite', serverStructures)
})


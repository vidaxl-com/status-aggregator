require('cowlog')()
  const serverStructures = require('./suites/data/server-structures')
  , suiteRunner = require('./suites/data/suiter-runner')
  , tr = require('./test-runners/bad-and-good-request-tracer')

describe('Functional Tests', ()=>{
  require('./suites/standalone/plain-server')
  suiteRunner('Good/Bad request evaluation suite', serverStructures, 'goodBad', tr)
})


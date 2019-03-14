const {createHandler, emptySuccessService, emptyFailureService, dataCompiler} = require('../lib/requires')
const dc = dataCompiler

module.exports = {
  description: 'simple one-server tests',
  success: [
    dc([createHandler(emptySuccessService(), 'one')], '001 successful',
      {
        goodBad: 'ok'
      })
  ],
  fail: [
    dc([createHandler(emptyFailureService(),'one')], '002 failed',
      {
        goodBad: 'bad'
      })
  ]
}


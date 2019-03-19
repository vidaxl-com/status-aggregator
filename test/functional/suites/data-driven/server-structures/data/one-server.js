// [require-a-lot] sessionTestIncludes begin
const {
  createHandler, 
  dataCompiler, 
  emptySuccessService, 
  emptyFailureService, 
}  
// [require-a-lot] sessionTestIncludes end
= require('../lib/requires')
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


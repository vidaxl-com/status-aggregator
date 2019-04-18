// [require-a-lot] sessionTestIncludes begin
const {
  createHandler, //reative path: ./create-handler
  dataCompiler, //reative path: ./data-compiler
  emptySuccessService, //reative path: ../../../../test-services/handlers/empty-success-service
  emptyFailureService, //reative path: ../../../../test-services/handlers/empty-failure-service
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


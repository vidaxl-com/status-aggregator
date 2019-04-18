// [require-a-lot] testIncludes begin
const {
  createHandler, //reative path: ./functional/suites/data-driven/server-structures/lib/create-handler
  dataCompiler, //reative path: ./functional/suites/data-driven/server-structures/lib/data-compiler
  emptySuccessService, //reative path: ./functional/test-services/handlers/empty-success-service
  emptyFailureService, //reative path: ./functional/test-services/handlers/empty-failure-service
}
// [require-a-lot] testIncludes end
= require('../../../../../requires')
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


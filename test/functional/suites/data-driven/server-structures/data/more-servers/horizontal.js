// [require-a-lot] sessionTestIncludes begin
const {
  createHandler, //reative path: ./create-handler
  dataCompiler, //reative path: ./data-compiler
  emptySuccessService, //reative path: ../../../../test-services/handlers/empty-success-service
  emptyFailureService, //reative path: ../../../../test-services/handlers/empty-failure-service
}  
// [require-a-lot] sessionTestIncludes end
  = require('../../lib/requires')
const dc = dataCompiler

module.exports = {
    description: 'Horzontal arrangement',
    success:[

      dc([
          createHandler(emptySuccessService(),'one'),
          createHandler(emptySuccessService(),'two')
        ], '003 successful 1',
        {
          goodBad: 'ok',
          objectPath: [
            {path: 'statusAggregatorResults.status', value: 'ok'},
            {path: 'statusAggregatorResults.generatedResults.0.data.statusAggregatorResults.status', value: 'ok'},
            {path: 'statusAggregatorResults.generatedResults.1.data.statusAggregatorResults.status', value: 'ok'},
          ]
        }),

      dc([
        createHandler(emptySuccessService(),'one'),
        createHandler(emptySuccessService(),'two'),
        createHandler(emptySuccessService(),'three')
      ], '004 successful 2', {goodBad: 'ok'})

    ] ,
    fail:[

      dc([
        createHandler(emptySuccessService(),'one'),
        createHandler(emptyFailureService(),'two')
      ], '005 failed', {goodBad: 'bad'}),

      dc([
        createHandler(emptySuccessService(),'one'),
        createHandler(emptyFailureService(),'two')
      ], '005.001 failed', {goodBad: 'bad'}),

      dc([
        createHandler(emptyFailureService(),'one'),
        createHandler(emptySuccessService(),'two')
      ], '005.002 failed', {goodBad: 'bad'}),

      dc([
        createHandler(emptyFailureService(),'empty-response'),
        createHandler(emptySuccessService(),'two')
      ], '005.003 failed', {goodBad: 'bad'})
    ]
  }

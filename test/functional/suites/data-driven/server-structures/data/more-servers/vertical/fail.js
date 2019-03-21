// [require-a-lot] sessionTestIncludes begin
const {
  createHandler, //reative path: ./create-handler
  dataCompiler, //reative path: ./data-compiler
  emptySuccessService, //reative path: ../../../../test-services/handlers/empty-success-service
  emptyFailureService, //reative path: ../../../../test-services/handlers/empty-failure-service
}  
// [require-a-lot] sessionTestIncludes end
= require('../../../lib/requires')
const dc = dataCompiler

module.exports = [
    dc([
        createHandler(emptyFailureService(),'mother'),
        [
          createHandler(emptySuccessService(),'child')
        ]
      ], '007 the fist layer fails',
      {
        goodBad: 'bad',
        summary: ['Two servers one fo them fails']
      },
      {
        summary: {
          get: {
            summary: 1
          }
        }
      }),


    dc([
        createHandler(emptySuccessService(),'NiceOne'),
        [
          createHandler(emptyFailureService(),'BadOne')
        ]
      ],
      '008 the second layer fails',
      {
        goodBad: 'bad',
        summary: ['Two servers one fo them fails']
      },
      {
        summary: {
          get: {
            summary: 1
          }
        }
      }),

    dc( [createHandler(emptySuccessService(),'1'),
        [
          createHandler(emptySuccessService(),'1.1'),
          [
            createHandler(emptyFailureService(),'1.1')
          ]
        ]
      ],
      '009 third layer fails', {goodBad: 'bad'}),
    dc([
        createHandler(emptyFailureService(),'1'),
        [
          [
            createHandler(emptySuccessService(),'1.1')
          ]
        ]
      ],
      '010 one of them fails', {goodBad: 'bad'}),

    dc( [
        createHandler(emptySuccessService(),'1'),
        [
          [
            createHandler(emptySuccessService(),'1.1.1'),
            [
              createHandler(emptyFailureService(),'1.1.1.1')
            ]
          ]
        ]
      ],
      '011 the last of them fails', {goodBad: 'bad'}),
  ]


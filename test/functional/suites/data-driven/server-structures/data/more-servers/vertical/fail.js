// [require-a-lot] testIncludes begin
const {
  createHandler, //reative path: ./functional/suites/data-driven/server-structures/lib/create-handler
  dataCompiler, //reative path: ./functional/suites/data-driven/server-structures/lib/data-compiler
  emptySuccessService, //reative path: ./functional/test-services/handlers/empty-success-service
  emptyFailureService, //reative path: ./functional/test-services/handlers/empty-failure-service
}
// [require-a-lot] testIncludes end
= require('../../../../../../../requires')
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


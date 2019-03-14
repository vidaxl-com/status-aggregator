const {createHandler, emptySuccessService, emptyFailureService, dataCompiler} = require('../../../lib/requires')
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
        summary:2
      },
      {
        summary: {
          get: {
            summary: 2
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
        summary: '3'
      },
      {
        summary: {
          get: {
            summary: 3
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


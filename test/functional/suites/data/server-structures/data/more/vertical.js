const {createHandler, emptySuccessService, emptyFailureService, dataCompiler} = require('../../lib/requires')
const dc = dataCompiler

module.exports = {
  description: 'Vertical arrangement',
  success:[
    dc([
      createHandler(emptySuccessService(),'1'),
      [
        createHandler(emptySuccessService(),'1.1'),
        createHandler(emptySuccessService(),'1.2')
      ]
    ], '006 none of them fails', {goodBad: 'ok'}),
    dc([
        createHandler(emptySuccessService(),'root'),
        [
          [
            [
              createHandler(emptySuccessService(),'edge1'),
              createHandler(emptySuccessService(),'edge2')
            ]
          ],
          createHandler(emptySuccessService(),'edge3'),
          createHandler(emptySuccessService(),'edge4')
        ]
      ], '006.001 none of them fails',
      {
        goodBad: 'ok',
        // summary:'1',
        flat: '--'
      },
      {
        summary: {
          get: {
            summary: 1
          }
        },

        flat:{
          get:{
            flat:1
          }
        }
      }),
  ] ,
  fail:[

    dc([
        createHandler(emptyFailureService(),'mother'),
        [
          createHandler(emptySuccessService(),'child')
        ]
      ], '007 the fist layer fails',
      {
        goodBad: 'bad',
        // summary:2
      },
      {
        summary: {
          get: {
            summary: 2
          }
        }
      }),


    dc( [
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
  }


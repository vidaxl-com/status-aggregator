const {createHandler, emptySuccessService, emptyFailureService, dataCompiler} = require('../../../lib/requires')
const dc = dataCompiler

module.exports = [
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
]

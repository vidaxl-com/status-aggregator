const createHandler = (handler,name)=> ({handler:handler(name)(), name})
const emptySuccessHandler = require('../../test-services/handlers/empty-success-service')
const emptyFailHander = require('../../test-services/handlers/empty-failure-service')
//dataCompiler
const dc = (structure, description, assertData, extraData) =>
  ({structure, description, assertData, extraData})

module.exports = {
  oneserver:{
    description: 'simple one-server tests',
    success: [
      dc([createHandler(emptySuccessHandler(), 'one')], '001 successful',
        {
          goodBad: 'ok'
        })
    ],
    fail: [
      dc([createHandler(emptyFailHander(),'one')], '002 failed',
        {
          goodBad: 'bad'
        })
    ]
  },
  more:{
    description: 'More server Status',
    horizontal:{
      description: 'Horzontal arrangement',
      success:[

        dc([
          createHandler(emptySuccessHandler(),'one'),
          createHandler(emptySuccessHandler(),'two')
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
          createHandler(emptySuccessHandler(),'one'),
          createHandler(emptySuccessHandler(),'two'),
          createHandler(emptySuccessHandler(),'three')
        ], '004 successful 2', {goodBad: 'ok'})

      ] ,
      fail:[

        dc([
          createHandler(emptySuccessHandler(),'one'),
          createHandler(emptyFailHander(),'two')
        ], '005 failed', {goodBad: 'bad'}),

        dc([
          createHandler(emptySuccessHandler(),'one'),
          createHandler(emptyFailHander(),'two')
        ], '005.001 failed', {goodBad: 'bad'}),

        dc([
          createHandler(emptyFailHander(),'one'),
          createHandler(emptySuccessHandler(),'two')
        ], '005.002 failed', {goodBad: 'bad'}),

        dc([
          createHandler(emptyFailHander(),'empty-response'),
          createHandler(emptySuccessHandler(),'two')
        ], '005.003 failed', {goodBad: 'bad'})
      ]
    },
    vertical:{
      description: 'Vertical arrangement',
      success:[
        dc([
          createHandler(emptySuccessHandler(),'1'),
          [
            createHandler(emptySuccessHandler(),'1.1'),
            createHandler(emptySuccessHandler(),'1.2')
          ]
        ], '006 none of them fails', {goodBad: 'ok'}),
        dc([
          createHandler(emptySuccessHandler(),'root'),
          [
            [
              [
                createHandler(emptySuccessHandler(),'edge1'),
                createHandler(emptySuccessHandler(),'edge2')
              ]
            ],
            createHandler(emptySuccessHandler(),'edge3'),
            createHandler(emptySuccessHandler(),'edge4')
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
            createHandler(emptyFailHander(),'mother'),
            [
              createHandler(emptySuccessHandler(),'child')
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
            createHandler(emptySuccessHandler(),'NiceOne'),
            [
              createHandler(emptyFailHander(),'BadOne')
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

        dc( [createHandler(emptySuccessHandler(),'1'),
            [
              createHandler(emptySuccessHandler(),'1.1'),
              [
                createHandler(emptyFailHander(),'1.1')
              ]
            ]
          ],
          '009 third layer fails', {goodBad: 'bad'}),
        dc([
          createHandler(emptyFailHander(),'1'),
            [
              [
                createHandler(emptySuccessHandler(),'1.1')
              ]
            ]
          ],
          '010 one of them fails', {goodBad: 'bad'}),

        dc( [
          createHandler(emptySuccessHandler(),'1'),
            [
              [
                createHandler(emptySuccessHandler(),'1.1.1'),
                [
                  createHandler(emptyFailHander(),'1.1.1.1')
                ]
              ]
            ]
          ],
          '011 the last of them fails', {goodBad: 'bad'}),
      ]
    }
  }
}

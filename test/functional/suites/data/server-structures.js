const createHandler = (handler,name)=> ({handler, name})
const emptySuccessHandler = require('../../test-services/handlers/empty-success-service')
const emptyFailHander = require('../../test-services/handlers/empty-failure-service')
//dataCompiler
const dc = (structure, description, assertData) =>
  ({structure, description, assertData})

module.exports = {
  oneserver:{
    description: 'simple one-server tests',
    success: [
      dc([createHandler(emptySuccessHandler(), 'one')], '001 successful', {goodBad: 'ok'})
    ],
    fail: [
      dc([createHandler(emptyFailHander,'one')], '002 failed',
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
        ], '003 successful 1', {goodBad: 'ok'}),

        dc([
          createHandler(emptySuccessHandler(),'one'),
          createHandler(emptySuccessHandler(),'two'),
          createHandler(emptySuccessHandler(),'three')
        ], '004 successful 2', {goodBad: 'ok'})

      ] ,
      fail:[

        dc([
          createHandler(emptySuccessHandler(),'one'),
          createHandler(emptyFailHander,'two')
        ], '005 failed', {goodBad: 'bad'}),

        dc([
          createHandler(emptySuccessHandler(),'one'),
          createHandler(emptyFailHander,'two')
        ], '005.001 failed', {goodBad: 'bad'}),

        dc([
          createHandler(emptyFailHander,'one'),
          createHandler(emptySuccessHandler(),'two')
        ], '005.002 failed', {goodBad: 'bad'}),

        dc([
          createHandler(emptyFailHander,'empty-response'),
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
      ] ,
      fail:[

        dc([
            createHandler(emptyFailHander,'1'),
            [
              createHandler(emptySuccessHandler(),'1.1')
            ]
          ], '007 the fist layer fails', {goodBad: 'bad'}),

        dc( [
            createHandler(emptySuccessHandler(),'1'),
            [
              createHandler(emptyFailHander,'1.1')
            ]
          ],
          '008 the second layer fails', {goodBad: 'bad'}),

        dc( [createHandler(emptySuccessHandler(),'1'),
            [
              createHandler(emptySuccessHandler(),'1.1'),
              [
                createHandler(emptyFailHander,'1.1')
              ]
            ]
          ],
          '009 third layer fails', {goodBad: 'bad'}),
        dc([
          createHandler(emptyFailHander,'1'),
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
                  createHandler(emptyFailHander,'1.1.1.1')
                ]
              ]
            ]
          ],
          '011 the last of them fails', {goodBad: 'bad'}),
      ]
    }
  }
}

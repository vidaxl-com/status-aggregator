// [require-a-lot] testIncludes begin
const {
  serverStarter, //reative path: ./functional/test-services/serverStarter
  axios, //axios@0.18.0 | https://github.com/axios/axios | Promise based HTTP client for the browser and node.js
  expect, //*tag* of chai | chai@4.2.0 | http://chaijs.com | BDD/TDD assertion library for node.js and the browser. T...
  debug, //debug@4.1.1 | https://github.com/visionmedia/debug#readme | small debugging utility
  flatten, //*alias* of flat | flat@4.1.0 | https://github.com/hughsk/flat | Take a nested Javascript object and flat...
  op, //*alias* of object-path | object-path@0.11.4 | https://github.com/mariocasciaro/object-path | Access deep obje...
  statusAggregator,
}
// [require-a-lot] testIncludes end
  = require('../../../requires')
const removeProtocol = require('./lib/remove-protocol')

module.exports =  describe('testing debug', ()=> {
  describe('we use .debug()', ()=>{
    it('.', async () => {
      const server0 = await serverStarter.handler(
        (req,res)=>{
          statusAggregator.addResponse(res).looseApiUrlCheck()
        }
      ).name('success')()
      const server01 = await serverStarter.handler(
        (req,res)=>{
          statusAggregator.addResponse(res).debug.addApi(removeProtocol(server0.getStatusUrl())).looseApiUrlCheck()
        }
      ).name('success')()
      const server = await serverStarter.handler((req,res)=>{
        statusAggregator.addResponse(res).addApi(removeProtocol(server01.getStatusUrl())).looseApiUrlCheck()
      }).name('success by non http url')()
      const data = await axios.get(server.getStatusUrl())
      expect(data.data.status).to.equal('ok')

      const responseData = data.data
      let flatData = flatten(responseData)
      Object.keys(flatData).filter(path => path.endsWith())
      const debugPath = 'statusAggregatorResults.generatedResults.0.data.statusAggregatorResults.debug'
      const debugData = op.get(responseData, debugPath, false)
      expect(debugData).not.to.equal(false, 'Debug variable should be boolean true')
      expect(op.get(debugData,'parameters.looseUrlCheck')).to.equal(true, 'parameters.looseUrlCheck')
      expect(op.get(debugData,'parameters.fail.failMsg')).to.equal(false, 'parameters.fail.failMsg')
      expect(op.get(debugData,'parameters.fail.fail')).to.equal(false, 'parameters.fail.fail')
      // expect(op.get(debug,'parameters.timeout')).to.equal(200, 'parameters.timeout')
      expect(op.get(debugData,'allTrueGoodResponse.notFail')).to.equal(true, 'allTrueGoodResponse.notFail')
      expect(op.get(debugData,'allTrueGoodResponse.validApiResponses')).to.equal(true, 'allTrueGoodResponse.validApiResponses')
      expect(op.get(debugData,'allTrueGoodResponse.validUrls')).to.equal(true, 'allTrueGoodResponse.validUrls')
      expect(op.get(debugData,'allTrueGoodResponse.notSomethingWentWrongDuringTheCommunitcation')).to.equal(true, 'allTrueGoodResponse.notSomethingWentWrongDuringTheCommunitcation')
      expect(op.get(debugData,'allTrueGoodResponse.notWeHaveBadResponses')).to.equal(true, 'allTrueGoodResponse.notWeHaveBadResponses')
      expect(op.get(debugData,'allTrueGoodResponse.status')).to.equal(true, 'allTrueGoodResponse.status')

      server01.stop()
      server0.stop()
      server.stop()
    })
  })
  describe('we don\'t use .debug()', ()=>{
    it('.', async () => {
      const server0 = await serverStarter.handler(
        (req,res)=>{
          statusAggregator.addResponse(res).looseApiUrlCheck()
        }
      ).name('success')()
      const server01 = await serverStarter.handler(
        (req,res)=>{
          statusAggregator.addResponse(res).addApi(removeProtocol(server0.getStatusUrl())).looseApiUrlCheck()
        }
      ).name('success')()
      const server = await serverStarter.handler((req,res)=>{
        statusAggregator.addResponse(res).addApi(removeProtocol(server01.getStatusUrl())).looseApiUrlCheck()
      }).name('success by non http url')()
      const data = await axios.get(server.getStatusUrl())
      expect(data.data.status).to.equal('ok')
      // l(data.data).die()
      const responseData = data.data
      let flatData = flatten(responseData)
      Object.keys(flatData).filter(path => path.endsWith())
      const debugPath = 'statusAggregatorResults.generatedResults.0.data.statusAggregatorResults.debug'
      const debugData = op.get(responseData, debugPath, false)
      expect(debugData).to.equal(false)

      server01.stop()
      server0.stop()
      server.stop()
    })
  })
})

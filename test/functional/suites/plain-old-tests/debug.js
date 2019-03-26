const axios = require('axios')
  , {expect} = require('chai')
  , serverStarter = require('../../test-services/serverStarter')
  , emptySuccessHandler = require('../../test-services/handlers/empty-success-service')
  , emptyfailureHandler = require('../../test-services/handlers/empty-failure-service')
  , nonExistingfailureHandler = require('../../test-services/handlers/non-existing-failure-service')
  , assert = require('assert')
  , extractNumbers = require('extract-numbers')
  , statusGenerator = require('../../../../src')
  , op = require('object-path')
  , flatten = require('flat')
  , removeProtocol = require('./lib/remove-protocol')

module.exports =  describe('testing debug', ()=> {
  describe('we use .debug()', ()=>{
    it('.', async () => {
      const server0 = await serverStarter.handler(
        (req,res)=>{
          statusGenerator.addResponse(res).looseApiUrlCheck()
        }
      ).name('success')()
      const server01 = await serverStarter.handler(
        (req,res)=>{
          statusGenerator.addResponse(res).debug.addApi(removeProtocol(server0.getStatusUrl())).looseApiUrlCheck()
        }
      ).name('success')()
      const server = await serverStarter.handler((req,res)=>{
        statusGenerator.addResponse(res).addApi(removeProtocol(server01.getStatusUrl())).looseApiUrlCheck()
      }).name('success by non http url')()
      const data = await axios.get(server.getStatusUrl())
      expect(data.data.status).to.equal('ok')

      const responseData = data.data
      let flatData = flatten(responseData)
      Object.keys(flatData).filter(path => path.endsWith())
      const debugPath = 'statusAggregatorResults.generatedResults.0.data.statusAggregatorResults.debug'
      const debug = op.get(responseData, debugPath, false)
      expect(debug).not.to.equal(false, 'Debug variable should be boolean true')
      expect(op.get(debug,'parameters.looseUrlCheck')).to.equal(true, 'parameters.looseUrlCheck')
      expect(op.get(debug,'parameters.fail.failMsg')).to.equal(false, 'parameters.fail.failMsg')
      expect(op.get(debug,'parameters.fail.fail')).to.equal(false, 'parameters.fail.fail')
      // expect(op.get(debug,'parameters.timeout')).to.equal(200, 'parameters.timeout')
      expect(op.get(debug,'allTrueGoodResponse.notFail')).to.equal(true, 'allTrueGoodResponse.notFail')
      expect(op.get(debug,'allTrueGoodResponse.validApiResponses')).to.equal(true, 'allTrueGoodResponse.validApiResponses')
      expect(op.get(debug,'allTrueGoodResponse.validUrls')).to.equal(true, 'allTrueGoodResponse.validUrls')
      expect(op.get(debug,'allTrueGoodResponse.notSomethingWentWrongDuringTheCommunitcation')).to.equal(true, 'allTrueGoodResponse.notSomethingWentWrongDuringTheCommunitcation')
      expect(op.get(debug,'allTrueGoodResponse.notWeHaveBadResponses')).to.equal(true, 'allTrueGoodResponse.notWeHaveBadResponses')
      expect(op.get(debug,'allTrueGoodResponse.status')).to.equal(true, 'allTrueGoodResponse.status')

      server01.stop()
      server0.stop()
      server.stop()
    })
  })
  describe('we don\'t use .debug()', ()=>{
    it('.', async () => {
      const server0 = await serverStarter.handler(
        (req,res)=>{
          statusGenerator.addResponse(res).looseApiUrlCheck()
        }
      ).name('success')()
      const server01 = await serverStarter.handler(
        (req,res)=>{
          statusGenerator.addResponse(res).addApi(removeProtocol(server0.getStatusUrl())).looseApiUrlCheck()
        }
      ).name('success')()
      const server = await serverStarter.handler((req,res)=>{
        statusGenerator.addResponse(res).addApi(removeProtocol(server01.getStatusUrl())).looseApiUrlCheck()
      }).name('success by non http url')()
      const data = await axios.get(server.getStatusUrl())
      expect(data.data.status).to.equal('ok')
      // l(data.data).die()
      const responseData = data.data
      let flatData = flatten(responseData)
      Object.keys(flatData).filter(path => path.endsWith())
      const debugPath = 'statusAggregatorResults.generatedResults.0.data.statusAggregatorResults.debug'
      const debug = op.get(responseData, debugPath, false)
      expect(debug).to.equal(false)

      server01.stop()
      server0.stop()
      server.stop()
    })
  })
})

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

module.exports =  describe('basic behaviour without deep nested structures', ()=> {
  it('With response object defined', async ()=>{
    let retpromiseData = false
    let handler = (req, res) => {
      statusGenerator.addResponse(res)()
        .then(
          data=>{
            retpromiseData = data
          })
    }

    const server = await serverStarter
      .handler(handler)
      .name('promise handler test server')()
    const data = await axios.get(server.getStatusUrl())
    expect(retpromiseData).to.deep.equal(data.data);
    server.stop()
  })
  it('Without response object defined', async ()=>{

    let handler = async (req, res) => {
      statusGenerator()
        .then(
          data=>{
            res.status(200).json({whatever:'you want', data})
          })

    }
    const server = await serverStarter
      .handler(handler)
      .name('promise handler test server')()
    let returnData = await axios.get(server.getStatusUrl())
    expect(Object.keys(returnData.data)).to.include('data').and.to.include('whatever')
    server.stop()
  })

})

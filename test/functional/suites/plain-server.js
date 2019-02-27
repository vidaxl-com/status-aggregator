const axios = require('axios')
  , {expect} = require('chai')
  , serverStarter = require('../test-services/serverStarter')
  , emptySuccessHandler = require('../test-services/handlers/empty-success-service')
  , emptyfailureHandler = require('../test-services/handlers/empty-failure-service')
  , nonExistingfailureHandler = require('../test-services/handlers/non-existing-failure-service')
  , assert = require('assert')
  , extractNumbers = require('extract-numbers')
  , statusGenerator = require('../../../src')

module.exports =  describe('Plain-server suite', ()=>{
  it('successful request', async ()=>{
    const server = await serverStarter.handler(emptySuccessHandler()).name('success')()
    const data = await axios.get(server.getStatusUrl())
    expect(data.data.statusAggregatorResults.status).to.equal('ok')
    expect(data.data.status).to.equal('ok')
    server.stop()
  })

  it('failed request', async ()=>{
    const server = await serverStarter.handler(emptyfailureHandler()).name('fail')()
    const data = await axios.get(server.getStatusUrl())
    expect(data.data.statusAggregatorResults.status).to.equal('bad')
    expect(data.data.status).to.equal('bad')
    server.stop()
  })

  it('non existing server', async ()=>{
    const server = await serverStarter
      .handler(nonExistingfailureHandler(2)).name('dependency does not exists')()
    const data = await axios.get(server.getStatusUrl())
    expect(data.data.statusAggregatorResults.status).to.equal('bad')
    expect(!!data.data.statusAggregatorResults.failMessage).to.equal(true)
    expect(data.data.statusAggregatorResults.failMessage.includes(' was not successful')).to.equal(true)
    expect(data.data.statusAggregatorResults.failMessage.includes('Connecting to http://localhost:')).to.equal(true)
    assert(extractNumbers(data.data.statusAggregatorResults.failMessage).length === 3)
    server.stop()
  })

  it('extraData server', async ()=>{
    const server = await serverStarter
      .handler(emptySuccessHandler.extraParameters({addExtraData:['yeah','no']})())
      .name('extraDataServer')()
    const data = await axios.get(server.getStatusUrl())
    expect(data.data.extraData[0]).to.equal('yeah')
    expect(data.data.extraData[1]).to.equal('no')
    server.stop()
  })

  it('User caused Fail', async ()=>{
    const server = await serverStarter
      .handler(emptySuccessHandler.extraParameters({fail:['I wanted to Fail It']})())
      .name('extraDataServer')()
    const data = await axios.get(server.getStatusUrl())
    expect(data.data.statusAggregatorResults.status).to.equal('bad')

    //todo: test fail message
    // l(data.data).die()
    // expect(data.data.extraData[0]).to.equal('yeah')
    // expect(data.data.extraData[1]).to.equal('no')
    server.stop()
  })

  it('Tests name prarameter', async ()=> {
    let handler = (req, res) => {
      statusGenerator.addResponse(res).name('my-awesome-server')()
    }

    const server = await serverStarter
      .handler(handler)
      .name('name parameter test')()

    const data = await axios.get(server.getStatusUrl())
    expect(data.data.name).to.equal('my-awesome-server');
    server.stop()
  })

  describe('Testing promiseData', function () {
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

  describe('Testing Url valiation', function () {
    const removeProtocoll = url => url.replace(/(^\w+:|^)\/\//, '');
    //starting with http:// or https://
    it('good formatted urls', async () => {
      const server = await serverStarter.handler(emptySuccessHandler()).name('success')()
      const data = await axios.get(server.getStatusUrl())
      expect(data.data.statusAggregatorResults.status).to.equal('ok')
      expect(data.data.status).to.equal('ok')
      server.stop()
    })

    describe('bad formatted urls', function () {
      it('default behaviour (fails)', async () => {
        const server0 = await serverStarter.handler(emptySuccessHandler()).name('success')()
        const server = await serverStarter.handler((req,res)=>{
          const statusWithoutProtocoll = removeProtocoll(server0.getStatusUrl())
          statusGenerator.addResponse(res).addApi(statusWithoutProtocoll)()
        }).name('fail by non http url')()
        const data = await axios.get(server.getStatusUrl())
        expect(data.data.status).to.equal('bad')
        server0.stop()
        server.stop()
      })

      it('default behaviour (fail)', async () => {
        const server0 = await serverStarter.handler(emptySuccessHandler()).name('success')()
        const server = await serverStarter.handler((req,res) =>
          statusGenerator
            .addResponse(res)
            .addApi(removeProtocoll(server0.getStatusUrl()))
            .looseApiUrlCheck())
          .name('fail by non http url')()
        const data = await axios.get(server.getStatusUrl())
        expect(data.data.status).to.equal('ok')
        server0.stop()
        server.stop()
      })

      it('default behaviour (success) .looseApiUrlCheck()', async () => {
        const server0 = await serverStarter.handler(emptySuccessHandler()).name('success')()
        const server = await serverStarter.handler((req,res)=>{
          const statusWithoutProtocoll = removeProtocoll(server0.getStatusUrl())
          statusGenerator.addResponse(res).addApi(statusWithoutProtocoll).looseApiUrlCheck()
        }).name('success by non http url')()
        const data = await axios.get(server.getStatusUrl())
        expect(data.data.status).to.equal('ok')
        server0.stop()
        server.stop()
      })
      // todo: make it run
      // it('Applying .looseApiUrlCheck() but no apis added', async () => {
      //   const server0 = await serverStarter.handler((req,res)=>{
      //     statusGenerator.addResponse(res).looseApiUrlCheck()
      //   }).name('Success .looseApiUrlCheck no API to check.')()
      //
      //   const server = await serverStarter.handler((req,res)=>{
      //     statusGenerator.addResponse(res).
      //     addApi(server0.getStatusUrl()).looseApiUrlCheck()
      //   }).name('Success by non http url.')()
      //
      //   const data = await axios.get(server.getStatusUrl())
      //   l(data.data).die()
      //   expect(data.data.status).to.equal('ok')
      //   server0.stop()
      //   server.stop()
      // })

      it('success by http url (success) .looseApiUrlCheck()', async () => {
        const server0 = await serverStarter.handler(
          (req,res)=>{
            statusGenerator.addResponse(res).looseApiUrlCheck()
          }
        ).name('success')()
        const server01 = await serverStarter.handler(
          (req,res)=>{
            statusGenerator.addResponse(res).addApi(removeProtocoll(server0.getStatusUrl())).looseApiUrlCheck()
          }
        ).name('success')()
        const server = await serverStarter.handler((req,res)=>{
          statusGenerator.addResponse(res).addApi(removeProtocoll(server01.getStatusUrl())).looseApiUrlCheck()
        }).name('success by non http url')()
        const data = await axios.get(server.getStatusUrl())
        expect(data.data.status).to.equal('ok')
        server01.stop()
        server0.stop()
        server.stop()
      })
    })

    describe('aaaa', ()=>{

    })
  })
})

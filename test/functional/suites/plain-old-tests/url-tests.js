// [require-a-lot] testIncludes begin
const {
  serverStarter, //reative path: ./functional/test-services/server-starter
  emptySuccessService, //reative path: ./functional/test-services/handlers/empty-success-service
  axios, //axios@0.18.0 | https://github.com/axios/axios | Promise based HTTP client for the browser and node.js
  expect, //*tag* of chai | chai@4.2.0 | http://chaijs.com | BDD/TDD assertion library for node.js and the browser. T...
  statusAggregator,
}
// [require-a-lot] testIncludes end
  = require('../../../requires')

module.exports =  describe('basic behaviour without deep nested structures', ()=> {
  const removeProtocoll = url => url.replace(/(^\w+:|^)\/\//, '');
  //starting with http:// or https://
  it('good formatted urls', async () => {
    const server = await serverStarter.handler(emptySuccessService()()()).name('success')()
    const data = await axios.get(server.getStatusUrl())
    expect(data.data.statusAggregatorResults.status).to.equal('ok')
    expect(data.data.status).to.equal('ok')
    server.stop()
  })

  describe('bad formatted urls', function () {
    it('default behaviour (without protocol fails)', async () => {
      const server0 = await serverStarter.handler(emptySuccessService()()()).name('success')()
      const server = await serverStarter.handler((req, res) => {
        const statusWithoutProtocoll = removeProtocoll(server0.getStatusUrl())
        statusAggregator.addResponse(res).addApi(statusWithoutProtocoll)()
      }).name('fail by non http url')()
      const data = await axios.get(server.getStatusUrl())
      expect(data.data.status).to.equal('bad')
      server0.stop()
      server.stop()
    })

    it('default behaviour (fail)', async () => {
      const server0 = await serverStarter.handler(emptySuccessService()()()).name('success')()
      const server = await serverStarter.handler((req,res) =>
        statusAggregator
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
      const server0 = await serverStarter.handler(emptySuccessService()()()).name('success')()
      const server = await serverStarter.handler((req,res)=>{
        const statusWithoutProtocoll = removeProtocoll(server0.getStatusUrl())
        statusAggregator.addResponse(res).addApi(statusWithoutProtocoll).looseApiUrlCheck()
      }).name('success by non http url')()
      const data = await axios.get(server.getStatusUrl())
      expect(data.data.status).to.equal('ok')
      server0.stop()
      server.stop()
    })

    describe('bad formatted urls', function () {
      it('Applying .looseApiUrlCheck() but no apis added', async () => {
        const server0 = await serverStarter.handler((req,res)=>{
          statusAggregator.addResponse(res).looseApiUrlCheck()
        }).name('Success .looseApiUrlCheck no API to check.')()

        const server = await serverStarter.handler((req,res)=>{
          statusAggregator.addResponse(res).
          addApi(server0.getStatusUrl()).looseApiUrlCheck()
        }).name('Success by non http url.')()

        const data = await axios.get(server.getStatusUrl())
        expect(data.data.status).to.equal('ok')
        server0.stop()
        server.stop()
      })

      it('success by http url (success) .looseApiUrlCheck()', async () => {
        const server0 = await serverStarter.handler(
          (req,res)=>{
            statusAggregator.addResponse(res).looseApiUrlCheck()
          }
        ).name('success')()
        const server01 = await serverStarter.handler(
          (req,res)=>{
            statusAggregator.addResponse(res).addApi(removeProtocoll(server0.getStatusUrl())).looseApiUrlCheck()
          }
        ).name('success')()
        const server = await serverStarter.handler((req,res)=>{
          statusAggregator.addResponse(res).addApi(removeProtocoll(server01.getStatusUrl())).looseApiUrlCheck()
        }).name('success by non http url')()
        const data = await axios.get(server.getStatusUrl())
        expect(data.data.status).to.equal('ok')
        server01.stop()
        server0.stop()
        server.stop()
      })
    })
  })
})

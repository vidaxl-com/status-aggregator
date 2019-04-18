// [require-a-lot] testIncludes begin
const {
  serverStarter, //reative path: ./functional/test-services/serverStarter
  axios, //axios@0.18.0 | https://github.com/axios/axios | Promise based HTTP client for the browser and node.js
  expect, //*tag* of chai | chai@4.2.0 | http://chaijs.com | BDD/TDD assertion library for node.js and the browser. T...
  statusAggregator,
}
// [require-a-lot] testIncludes end
  = require('../../../requires')

module.exports =  describe('basic behaviour without deep nested structures', ()=> {
  it('With response object defined', async ()=>{
    let retpromiseData = false
    let handler = (req, res) => {
      statusAggregator.addResponse(res)()
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
      statusAggregator()
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

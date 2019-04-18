// [require-a-lot] testIncludes begin
const {
  serverStarter, //reative path: ./functional/test-services/serverStarter
  serversPatch, //reative path: ./functional/suites/plain-old-tests/lib/servers-patch
  statusAggregator,
}
// [require-a-lot] testIncludes end
  = require('../../../../../requires')
// l(statusAggregator).die()
module.exports = async()=>{
  const returnArray = [

    await serverStarter.handler(
      (req,res)=>{
        statusAggregator
          .addResponse(res)
          .mockId('a')
          .request(req)()
      }
    ).name('success 0')(),

    await serverStarter.handler(
      (req,res)=>{
        statusAggregator
          .addResponse(res)
          .addApi(returnArray[0].getStatusUrl())
          .mockId('b')
          .request(req)()
      }).name('success 01')(),

    await serverStarter.handler((req,res)=>{
      statusAggregator
        .addApi(returnArray[1].getStatusUrl())
        .addResponse(res)
        .mockId('c')
        .request(req)()
    }).name('server')()
  ]

  return serversPatch(returnArray)
}

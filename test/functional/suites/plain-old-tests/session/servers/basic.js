// [require-a-lot] sessionTestIncludes begin
const {
  serverStarter, //reative path: ../../../test-services/serverStarter
  statusAggregator, 
  serversPatch, //reative path: ./servers-patch
}  
// [require-a-lot] sessionTestIncludes end
  = require('../../lib/requires')
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

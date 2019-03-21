// [require-a-lot] sessionTestIncludes begin
const {
  serverStarter, //reative path: ../../../test-services/serverStarter
  statusAggregator,
  serversPatch,
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
          .name('000')
          .request(req)()
      }
    ).name('s1')(),

    await serverStarter.handler(
      (req,res)=>{
        statusAggregator
          .addApi(returnArray[0].getStatusUrl())
          .addResponse(res)
          .mockId('b')
          .name('001')
          .request(req)()
      }).name('s2')(),

    await serverStarter.handler((req,res)=>{
      statusAggregator
        .addApi(returnArray[0].getStatusUrl())
        .addApi(returnArray[1].getStatusUrl())
        .addResponse(res)
        .mockId('c')
        .name('002')
        .request(req)()
    }).name('s3')(),

    await serverStarter.handler((req,res)=>{
      statusAggregator
        .addApi(returnArray[0].getStatusUrl())
        .addApi(returnArray[1].getStatusUrl())
        .addApi(returnArray[2].getStatusUrl())
        .addResponse(res)
        .mockId('c')
        .name('003')
        .request(req)()
    }).name('s4')(),

    await serverStarter.handler((req,res)=>{
      statusAggregator
        .addApi(returnArray[0].getStatusUrl())
        .addApi(returnArray[1].getStatusUrl())
        .addApi(returnArray[2].getStatusUrl())
        .addApi(returnArray[3].getStatusUrl())
        .addResponse(res)
        .mockId('c')
        .name('004')
        .request(req)()
    }).name('s5')(),

    await serverStarter.handler((req,res)=>{
      statusAggregator
        .addApi(returnArray[0].getStatusUrl())
        .addApi(returnArray[1].getStatusUrl())
        .addApi(returnArray[2].getStatusUrl())
        .addApi(returnArray[3].getStatusUrl())
        .addApi(returnArray[4].getStatusUrl())
        .addResponse(res)
        .mockId('c')
        .name('005')
        .request(req)()
    }).name('s6')()
  ]

  return serversPatch(returnArray)
}

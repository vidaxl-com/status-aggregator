// [require-a-lot] sessionTestIncludes begin
const {
  serverStarter, //reative path: ../../../test-services/serverStarter
  statusAggregator,
  serversPatch, //reative path: ./servers-patch
}
// [require-a-lot] sessionTestIncludes end
  = require('../../lib/requires')

const addApis = (statusAggregator, statusUrls) => {
  statusUrls.forEach(url=>{
    statusAggregator.addApi(url)
  })

  return statusAggregator
}
module.exports = async()=>{
  let startPortChecker = await serverStarter.handler(
    (req,res)=>{
      statusAggregator
        .addResponse(res)
        .mockId('a')
        .name('000')
        .request(req)()
    }
  ).name('s1')()
  let portOriginal = startPortChecker.port
  let portFrom = portOriginal
  const statusUrl = startPortChecker.getStatusUrl()

  const replacePort = (myPort)=>statusUrl.replace(''+portOriginal, myPort)
  const statusUrls = [++portFrom, ++portFrom, ++portFrom, ++portFrom, ++portFrom, ++portFrom]
    .map(port=>replacePort(port))
  const returnArray = [
    await serverStarter.handler(
      (req,res)=>{
        statusAggregator
          .addResponse(res)
          .mockId('a')
          .namedSession
          .request(req)()
      }
    ).name('s1')(),

    await serverStarter.handler(
      (req,res)=>{
          addApis(statusAggregator,statusUrls)
          .addResponse(res)
          .mockId('b')
          .name('001')
          .namedSession
          .request(req)()
      }).name('s2')(),

    await serverStarter.handler((req,res)=>{
      addApis(statusAggregator,statusUrls)
        .addApi(returnArray[0].getStatusUrl())
        .addApi(returnArray[1].getStatusUrl())
        .addResponse(res)
        .mockId('c')
        .name('002')
        .namedSession
        .request(req)()
    }).name('s3')(),

    await serverStarter.handler((req,res)=>{
      addApis(statusAggregator,statusUrls)
        .addResponse(res)
        .mockId('d')
        .name('003')
        .namedSession
        .request(req)()
    }).name('s4')(),

    await serverStarter.handler((req,res)=>{
      addApis(statusAggregator,statusUrls)
        .addResponse(res)
        .mockId('e')
        .name('004')
        .namedSession
        .request(req)()
    }).name('s5')(),

    await serverStarter.handler((req,res)=>{
      addApis(statusAggregator,statusUrls)
        .addResponse(res)
        .mockId('f')
        .name('005')
        .namedSession
        .request(req)()
    }).name('s6')()
  ]

  serversPatch(returnArray)
  returnArray.stopAll = ()=>{
    returnArray.stop()
    startPortChecker.stop()
  }

  return returnArray
}

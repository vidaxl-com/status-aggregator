// [require-a-lot] testIncludes begin
const {
  serverStarter, //reative path: ./functional/test-services/serverStarter
  serversPatch, //reative path: ./functional/suites/plain-old-tests/lib/servers-patch
  statusAggregator,
}
// [require-a-lot] testIncludes end
  = require('../../../../../requires')

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
        .name('name-first')
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
          .name('name-000')
          .request(req)()
      }
    ).name('s1')(),

    await serverStarter.handler(
      (req,res)=>{
          addApis(statusAggregator,statusUrls)
          .addResponse(res)
          .mockId('b')
          .name('name-001')
          .request(req)()
      }).name('s2')(),

    await serverStarter.handler((req,res)=>{
      addApis(statusAggregator,statusUrls)
        .addApi(returnArray[0].getStatusUrl())
        .addApi(returnArray[1].getStatusUrl())
        .addResponse(res)
        .mockId('c')
        .name('name-002')
        .request(req)()
    }).name('s3')(),

    await serverStarter.handler((req,res)=>{
      addApis(statusAggregator,statusUrls)
        .addResponse(res)
        .mockId('d')
        .name('name-003')
        .request(req)()
    }).name('s4')(),

    await serverStarter.handler((req,res)=>{
      addApis(statusAggregator,statusUrls)
        .addResponse(res)
        .mockId('e')
        .name('name-004')
        .request(req)()
    }).name('s5')(),

    await serverStarter.handler((req,res)=>{
      addApis(statusAggregator,statusUrls)
        .addResponse(res)
        .mockId('f')
        .name('name-005')
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

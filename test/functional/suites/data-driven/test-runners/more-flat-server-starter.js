const arrify = require('arrify')
  , debugTraffic = require('debug')('status-aggregator-test:trafficDetails')
  , callDetails = require('debug')('status-aggregator-test:callDetails')
  , arrayDsl = require('array-dsl')

module.serverNameCount = 0
module.exports =  (serverStarter, statusAggregator, serviceHandlers, allServers = [], addRequestToServerN = false) => {
  let servers = []
  serviceHandlers = arrify(serviceHandlers)
  return new Promise(async (resolve, reject) => {
    // let servers = []
    for(let i = 0; i < serviceHandlers.length; i++){
      const serviceHandler = serviceHandlers[i]
      const isHandlerArray = Array.isArray(serviceHandler)
      if(!isHandlerArray){
        servers.push(await serverStarter.handler([(req, res, next)=>{
          debugTraffic(`${serviceHandler.name} is called`)
          next()
        },serviceHandler.handler]).name(serviceHandler.name)())
        allServers.push(servers[servers.length-1])
      }
      if(isHandlerArray){
        let newServerGroup = await module.exports(serverStarter, statusAggregator, serviceHandler, allServers)
        servers.push(newServerGroup.serverN)
        allServers.push(newServerGroup.serverN)
      }
    }

    let serverN = await serverStarter.handler([
      (req, res, next) => {
        // debugTraffic(`<-initiated-traffic-from-host->`)
        next()
      },
      (req, res) => {
        for(let i = 0; i < servers.length; i++){
          statusAggregator.addApi(servers[i].getStatusUrl())
          callDetails(servers[i].getStatusUrl())
        }
        statusAggregator.addResponse(res)

        if(addRequestToServerN){
          statusAggregator.request(req)
        }

        statusAggregator()
      }])()
    allServers.push(serverN)
    resolve( {
      allServers,
      servers, serverN,
      stop: function(){
        arrayDsl(this.allServers).unique().forEach(server=>server.stop())
      }
    })
  })
}

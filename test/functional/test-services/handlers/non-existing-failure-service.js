const portscanner = require('portscanner')
  , statusAggregator = require('../../../../src')

module.exports = (numberOfServers) => (req,res) => {
  new Promise(async (resolve, reject)=>{
    for(let i = 0; i < numberOfServers; i++){
      // make sure get a non exposed port that does not server anyhing.
      // The tests servers get it form the range 3000-40000
      const port = await portscanner.findAPortNotInUse(4001+i, 5000)
      statusAggregator.addApi(`http://localhost:${port}`)
    }
    statusAggregator.addResponse(res)
      .request(req)()
    resolve()
  })
}

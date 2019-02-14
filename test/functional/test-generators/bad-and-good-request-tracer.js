module.exports = (serverStarter, statusGenerator, axios, expect) =>
  (name, serviceHandlers, assertData) =>
  it(`${name}`, async ()=>{
    let servers = await require('./more-flat-server-starter')(serverStarter, statusGenerator, serviceHandlers)
    const data = await axios.get(servers.serverN.getStatusUrl())
    if(!!assertData){
      expect(data.data.status).to.equal(assertData)
    }
    servers.stop()
  })

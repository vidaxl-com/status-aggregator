// [require-a-lot] sessionTestIncludes begin
const {
  serverStarter, //reative path: ../../../test-services/serverStarter
  statusAggregator,
}
// [require-a-lot] sessionTestIncludes end
  = require('./requires')
module.exports = (array)=>{
  array.stop = () => array.forEach(serverObject=>{
    serverObject.stop()
  })

  return array
}

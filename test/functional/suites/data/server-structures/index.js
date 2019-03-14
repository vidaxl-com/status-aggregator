const {createHandler, emptySuccessService, emptyFailureService, dataCompiler} = require('./lib/requires')
const dc = dataCompiler

const {oneServer, more} = require('./data/requires')

module.exports = {
  oneServer,
  more
}

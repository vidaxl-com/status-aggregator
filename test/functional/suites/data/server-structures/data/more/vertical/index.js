const {createHandler, emptySuccessService, emptyFailureService, dataCompiler} = require('../../../lib/requires')
const dc = dataCompiler

module.exports = {
  description: 'Vertical arrangement',
  success: require('./success') ,
  fail:require('./fail')
}


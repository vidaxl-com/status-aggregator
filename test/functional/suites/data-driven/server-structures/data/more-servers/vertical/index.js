// [require-a-lot] sessionTestIncludes begin
const {
  createHandler, 
  dataCompiler, 
  emptySuccessService, 
  emptyFailureService, 
}  
// [require-a-lot] sessionTestIncludes end
  = require('../../../lib/requires')
const dc = dataCompiler

module.exports = {
  description: 'Vertical arrangement',
  success: require('./success') ,
  fail:require('./fail')
}


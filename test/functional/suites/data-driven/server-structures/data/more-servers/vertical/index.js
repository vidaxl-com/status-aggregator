// [require-a-lot] sessionTestIncludes begin
const {
  dataCompiler, //reative path: ./data-compiler
}
// [require-a-lot] sessionTestIncludes end
  = require('../../../lib/requires')
const dc = dataCompiler

module.exports = {
  description: 'Vertical arrangement',
  success: require('./success') ,
  fail:require('./fail')
}


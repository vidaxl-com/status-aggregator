// [require-a-lot] testIncludes begin
const {
  dataCompiler, //reative path: ./functional/suites/data-driven/server-structures/lib/data-compiler
}
// [require-a-lot] testIncludes end
  = require('../../../../../../../requires')
const dc = dataCompiler

module.exports = {
  description: 'Vertical arrangement',
  success: require('./success') ,
  fail:require('./fail')
}


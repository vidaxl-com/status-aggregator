const path = require('path')
module.exports = require('require-a-lot')(require)
('./create-handler', './data-compiler',
  '../../../../test-services/handlers/empty-success-service',
  '../../../../test-services/handlers/empty-failure-service')
  //remove the comment below if you want to update your requires
  // .tag("sessionTestIncludes").linkDirectory(path.join(__dirname, '../', )).log.info.removeUnused
  ()


const path = require('path')
module.exports = require('require-a-lot')(require)
('./create-handler', './data-compiler',
  '../../../../test-services/handlers/empty-success-service',
  '../../../../test-services/handlers/empty-failure-service')
  // .alias('src', 'statusAggregator').alias('object-path', 'op').alias('flat', 'flatten')
  .tag("sessionTestIncludes")
  .linkDirectory(path.join(__dirname, '../', ))
  .log.info
  ()


const path = require('path')

module.exports = require('require-a-lot')(require)
('axios', 'chai',
  '../../../test-services/serverStarter',
  '../../../test-services/handlers/empty-success-service',
  '../../../test-services/handlers/empty-failure-service',
  '../../../test-services/handlers/non-existing-failure-service',
  'assert',
  'extract-numbers',
  '../../../../../src',
  'object-path',
  'flat',
  './servers-patch',
  'array-dsl',
).from('chai',['expect'])
  .alias('src', 'statusAggregator').alias('object-path', 'op').alias('flat', 'flatten')
  //remove the comment below if you want to update your requires
  // .tag("sessionTestIncludes").linkDirectory(path.join(__dirname, '../../')).log.info.removeUnused
()

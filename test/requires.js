require('../src')
require('./functional/test-services/handlers/empty-success-service')
module.exports = require('require-a-lot')(require)
(
  './functional/test-services/serverStarter',
  './functional/suites/data-driven/server-structures/lib/create-handler',
  './functional/suites/data-driven/server-structures/lib/data-compiler',
  './functional/test-services/handlers/empty-success-service',
  './functional/test-services/handlers/empty-failure-service',
  'decamelize',
  'axios',
  'chai',
  'debug',
  'flat',
  'object-path',
  'assert',
  'extract-numbers',
  'array-dsl',
  './functional/suites/plain-old-tests/lib/servers-patch',
  '../src',
  'dsl-framework',
  'portscanner',
  'arrify',
  './functional/test-services/handlers/empty-success-service',
  './functional/test-services/handlers/empty-failure-service',
  './functional/test-services/handlers/non-existing-failure-service'
)
.from('chai',['expect'])
  .alias('src', 'statusAggregator')
  .alias('object-path', 'op')
  .alias('flat', 'flatten')
//remove the comment below if you want to update your requires
.tag("testIncludes")
  .linkDirectory(__dirname)
  .log
  .info
  .removeUnused
()


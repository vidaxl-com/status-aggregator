require('../src')
module.exports = require('require-a-lot')(require)
(
  './functional/test-services/serverStarter',
  './functional/suites/data-driven/server-structures/lib/create-handler',
  './functional/suites/data-driven/server-structures/lib/data-compiler',
  './functional/test-services/handlers/empty-success-service',
  './functional/test-services/handlers/empty-failure-service',
  'axios',
  'chai',
  'object-path',
  'flat',
  'assert',
  'extract-numbers',
  'array-dsl',
  './functional/suites/plain-old-tests/lib/servers-patch',
  '../src'
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

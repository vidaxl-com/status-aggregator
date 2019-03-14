module.exports = require('require-a-lot')(require)
('./create-handler', './data-compiler',
  '../../../../test-services/handlers/empty-success-service',
  '../../../../test-services/handlers/empty-failure-service')


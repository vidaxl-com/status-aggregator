// process.env.DEBUG = ' express:, status-aggregator-test:*'
require('cowlog')();

describe('All Tests',  function () {
    // require('./unit')
    require('./functional')
})

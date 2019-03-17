const axios = require('axios')
  , {expect} = require('chai')
  , serverStarter = require('../../test-services/serverStarter')
  , emptySuccessHandler = require('../../test-services/handlers/empty-success-service')
  , emptyfailureHandler = require('../../test-services/handlers/empty-failure-service')
  , nonExistingfailureHandler = require('../../test-services/handlers/non-existing-failure-service')
  , assert = require('assert')
  , extractNumbers = require('extract-numbers')
  , statusGenerator = require('../../../../src')
  , op = require('object-path')
  , flatten = require('flat')

module.exports =  describe('basic behaviour without deep nested structures', ()=> {

})

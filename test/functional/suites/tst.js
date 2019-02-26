process.env.DEBUG = ' express:, status-aggregator-test:*'

const axios = require('axios')
  , {expect} = require('chai')
  , serverStarter = require('../test-services/serverStarter')
  , emptySuccessHandler = require('../test-services/handlers/empty-success-service')
  , emptyfailureHandler = require('../test-services/handlers/empty-failure-service')
  , nonExistingfailureHandler = require('../test-services/handlers/non-existing-failure-service')
  , assert = require('assert')
  , extractNumbers = require('extract-numbers')
  , statusGenerator = require('../../../src')
  , removeProtocoll = url => url.replace(/(^\w+:|^)\/\//, '');

require('cowlog')()

cc = async () =>{
  const server0 = await serverStarter.handler((req,res)=>{
    statusGenerator.addResponse(res)
      .addExtraData({a:'ffff',b:'cc'})
      .name('server0')
  }).name('server0')()
  const server00 = await serverStarter.handler((req,res)=>{
    statusGenerator.addResponse(res)
    // .addApi('http://api-gateway.sprint.local.vidaxl.beer/productparentservice/sdoservice/v1/product-parent/status')
    // .addApi('http://api-gateway.sprint.local.vidaxl.beer/1/cd6e7aff75a80308ee37cf8f2979600a/productcatalogservice/sdoservice/status')
      .addExtraData({a:'GGG',b:'cc'})
      .name('server00')
      .addApi(removeProtocoll(server0.getStatusUrl()))
      .looseApiUrlCheck
      ()
  }).name('server00')()

  const server000 = await serverStarter.handler((req,res)=>{
    statusGenerator.addResponse(res)
    // .addApi('http://api-gateway.sprint.local.vidaxl.beer/productparentservice/sdoservice/v1/product-parent/status')
    // .addApi('http://api-gateway.sprint.local.vidaxl.beer/1/cd6e7aff75a80308ee37cf8f2979600a/productcatalogservice/sdoservice/status')
      .addExtraData({a:'HHHH',b:'cc'})
      .name('server000')
      .addApi(server00.getStatusUrl())
      ()

  }).name('server000')()
  const server = await serverStarter.handler((req,res)=>{
    // statusGenerator.addResponse(res).addApi(statusWithoutProtocoll)()
    statusGenerator.addResponse(res)
      .addExtraData({a:'LLLL',b:'cc'})
      .name('server')
      .addApi(server000.getStatusUrl())
      ()
  }).name('server')()
  l(server.getStatusUrl())()

}

cc()

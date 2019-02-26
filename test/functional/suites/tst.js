const axios = require('axios')
  , {expect} = require('chai')
  , serverStarter = require('../test-services/serverStarter')
  , emptySuccessHandler = require('../test-services/handlers/empty-success-service')
  , emptyfailureHandler = require('../test-services/handlers/empty-failure-service')
  , nonExistingfailureHandler = require('../test-services/handlers/non-existing-failure-service')
  , assert = require('assert')
  , extractNumbers = require('extract-numbers')
  , statusGenerator = require('../../../src')

require('cowlog')()

cc = async () =>{
  const server0 = await serverStarter.handler((req,res)=>{
    statusGenerator.addResponse(res)
    // .addApi('http://api-gateway.sprint.local.vidaxl.beer/productparentservice/sdoservice/v1/product-parent/status')
    //   .addApi(server0.getStatusUrl())
      .addExtraData({a:'ffff',b:'cc'})
      .name('BBBBBBBBBB')

  }).name('success')()
  const server00 = await serverStarter.handler((req,res)=>{
    statusGenerator.addResponse(res)
    // .addApi('http://api-gateway.sprint.local.vidaxl.beer/productparentservice/sdoservice/v1/product-parent/status')
    // .addApi('http://api-gateway.sprint.local.vidaxl.beer/1/cd6e7aff75a80308ee37cf8f2979600a/productcatalogservice/sdoservice/status')
      .addExtraData({a:'GGG',b:'cc'})
      .name('AAAAAAAA')
      .addApi(server0.getStatusUrl())
      ()

  }).name('success')()
  const server000 = await serverStarter.handler((req,res)=>{
    statusGenerator.addResponse(res)
    // .addApi('http://api-gateway.sprint.local.vidaxl.beer/productparentservice/sdoservice/v1/product-parent/status')
    // .addApi('http://api-gateway.sprint.local.vidaxl.beer/1/cd6e7aff75a80308ee37cf8f2979600a/productcatalogservice/sdoservice/status')
      .addExtraData({a:'HHHH',b:'cc'})
      .name('CCCCCCCC')
      .addApi(server00.getStatusUrl())
      ()

  }).name('success')()
  const server = await serverStarter.handler((req,res)=>{
    // statusGenerator.addResponse(res).addApi(statusWithoutProtocoll)()
    statusGenerator.addResponse(res)
      .addExtraData({a:'LLLL',b:'cc'})
      .name('DDDDDDD')
      .addApi(server000.getStatusUrl())
      ()
  }).name('fail by non http url')

    ()
  // const data = await axios.get(server.getStatusUrl())
  l(server.getStatusUrl())()
  // server0.stop()
  // server.stop()
}

cc()

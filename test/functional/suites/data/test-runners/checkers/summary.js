const {expect} = require('chai')
  , assertLog = require('debug')('status-aggregator-test:assertLog:goodBad')
  , flat = require('flat')
  , op = require('object-path')
module.exports = (data, assertData) => {
  //todo: make some meaningful tests
  data = data.data
  l(assertData,data).lol()
}

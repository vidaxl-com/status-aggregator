const {expect} = require('chai')
  , assertLog = require('debug')('status-aggregator-test:assertLog:goodBad')
  , flat = require('flat')
  , op = require('object-path')
module.exports = (data, assertData) => {
l(assertData,data.data).lol()
  console.log(data.data)
}

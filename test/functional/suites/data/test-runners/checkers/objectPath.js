const {expect} = require('chai')
  , op = require('object-path')

module.exports = (data, assertData) => {
  data = data.data
  assertData.forEach(testDataItem => expect(op.get(data, testDataItem.path, testDataItem.value)))
}

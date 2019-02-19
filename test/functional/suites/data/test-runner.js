const op = require('object-path')
  , tr = require('../../test-generators/bad-and-good-request-tracer')
  , extractNumbers = require('extract-numbers')

module.exports = (dataset, assertPath, asserts) => {
  const magic = asserts.map(a=> ({
    order:extractNumbers(a)[0],
    pathBegin: a.slice(0, a.indexOf('.'))
  }))
  magic.forEach(testEntry => {
    const testData = dataset[testEntry.pathBegin][testEntry.order]
    tr(testData.description, testData.structure, testData.assertData[assertPath])
  })
}

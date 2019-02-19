const extractNumbers = require('extract-numbers')
const tr = require('../../test-runners/base')

module.exports = (dataset, assertPath, asserts,
                  testCallback=(tr,assertPath,testData)=>
                    tr(testData.description, testData.structure, testData.assertData[assertPath], assertPath)) => {
  const magic = asserts.map(a=> ({
    order:extractNumbers(a)[0],
    pathBegin: a.slice(0, a.indexOf('.'))
  }))
  magic.forEach(testEntry => {
    const testData = dataset[testEntry.pathBegin][testEntry.order]
    testCallback(tr,assertPath,testData,assertPath)
  })
}

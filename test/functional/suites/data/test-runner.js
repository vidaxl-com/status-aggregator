const extractNumbers = require('extract-numbers')

module.exports = (dataset, assertPath, asserts, tr,
                  testCallback=(tr,assertPath,testData)=>
                    tr(testData.description, testData.structure, testData.assertData[assertPath])) => {
  const magic = asserts.map(a=> ({
    order:extractNumbers(a)[0],
    pathBegin: a.slice(0, a.indexOf('.'))
  }))
  magic.forEach(testEntry => {
    const testData = dataset[testEntry.pathBegin][testEntry.order]
    testCallback(tr,assertPath,testData)
  })
}

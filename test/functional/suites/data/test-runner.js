const extractNumbers = require('extract-numbers')
const tr = require('./test-runners/base')
const arrayDsl = require('array-dsl')
module.exports = (dataset, assertPath, asserts,
                  testCallback=(tr,assertPath,testData)=>
                    tr(testData.description, testData.structure, testData.assertData[assertPath], assertPath)) => {
  const magic = arrayDsl(asserts.map(a=> (
    JSON.stringify({
    order:extractNumbers(a)[0],
    pathBegin: a.slice(0, a.indexOf('.'))
  })))).unique().map(jsonString=>JSON.parse(jsonString))

  magic.forEach(testEntry => {
    const testData = dataset[testEntry.pathBegin][testEntry.order]
    testCallback(tr,assertPath,testData,assertPath)
  })
}

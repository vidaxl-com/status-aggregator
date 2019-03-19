const extractNumbers = require('extract-numbers')
const tr = require('./test-runners/base')
const arrayDsl = require('array-dsl')
const op = require('object-path')

module.exports = (dataset, assertPath, asserts,
                  testCallback=(tr,assertPath,testData)=>
                    tr(testData.description,
                      testData.structure,
                      testData.assertData[assertPath],
                      testData.extraData,
                      assertPath,
                      op.get(testData,`extraData.${assertPath}.get`, false))) => {
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

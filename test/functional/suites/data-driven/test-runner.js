// [require-a-lot] testIncludes begin
const {
  op, //*alias* of object-path | object-path@0.11.4 | https://github.com/mariocasciaro/object-path | Access deep obje...
  extractNumbers,
  arrayDsl,
}
// [require-a-lot] testIncludes end
  = require('../../../requires')

const tr = require('./test-runners/base')

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

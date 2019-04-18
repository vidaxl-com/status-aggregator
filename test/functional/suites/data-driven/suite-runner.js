// [require-a-lot] testIncludes begin
const {
  flatten, //*alias* of flat | flat@4.1.0 | https://github.com/hughsk/flat | Take a nested Javascript object and flat...
  op, //*alias* of object-path | object-path@0.11.4 | https://github.com/mariocasciaro/object-path | Access deep obje...
}
// [require-a-lot] testIncludes end
  = require('../../../requires')

const testRunner = require('./test-runner')
  ,testPathGetter = require('./test-data-path-getter')

module.exports= (name, serverStructures, assertPath) => {
  const testPaths = testPathGetter(serverStructures)

  describe(name, ()=>{
    testPaths.forEach(testPath => {
      const test = op.get(serverStructures, `${testPath}`)
      const testFlat = flatten(test)

      return describe(test['description'], ()=>{
        const asserts = Object.keys(testFlat).filter(path=>
          path.includes(`assertData.${assertPath}`))
        testRunner(test, assertPath, asserts)
      })
    })
  })
}


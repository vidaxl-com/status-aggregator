const op = require('object-path')
  , testRunner = require('./test-runner')
  , testPathGetter = require('./test-data-path-getter')
  , flatten = require('flat')


module.exports= (name, serverStructures, assertPath, tr) => {
  const testPaths = testPathGetter(serverStructures)

  describe(name, ()=>{
    testPaths.forEach(testPath => {
      const test = op.get(serverStructures, `${testPath}`)
      const testFlat = flatten(test)

      return describe(test['description'], ()=>{
        const asserts = Object.keys(testFlat).filter(path=>
          path.includes(`assertData.${assertPath}`))
        testRunner(test, assertPath, asserts, tr)
      })
    })
  })
}


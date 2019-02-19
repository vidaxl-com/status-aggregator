const op = require('object-path')
  , testRunner = require('./test-runner')
  , testPathGetter = require('./test-data-path-getter')
  , flatten = require('flat')


module.exports= (name, serverStructures, assertPath) => {
  const testPaths = testPathGetter(serverStructures)

  describe(name, ()=>{
    const retData = {}
    testPaths.forEach(testPath => {
      const test = op.get(serverStructures, `${testPath}`)
      const testFlat = flatten(test)

      return describe(test['description'], ()=>{
        const asserts = Object.keys(testFlat).filter(path=>
          path.includes(`assertData.${assertPath}`))
        // if(asserts.length){
        //   retData
        // }

        testRunner(test, assertPath, asserts)
      })
    })
  })
}


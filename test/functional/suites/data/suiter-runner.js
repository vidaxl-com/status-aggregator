const op = require('object-path')
  , testRunner = require('./test-runner')
  , testPathGetter = require('./test-data-path-getter')


module.exports= (name, serverStructures) => {
  const  testPaths = testPathGetter(serverStructures)

  describe(name, ()=>{
    testPaths.forEach(testPath => {
      const test = op.get(serverStructures, `${testPath}`)
      return describe(test['description'], ()=>{
        testRunner(test, 'assertData.goodBad')
      })
    })
  })
}


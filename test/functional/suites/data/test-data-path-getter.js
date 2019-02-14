const flatten = require('flat')
  , arrayDsl = require('array-dsl')

module.exports = (serverStructures) => {
  const flattenedTestData = flatten(serverStructures)
  let testPaths = Object.keys(flattenedTestData)
    .map(path=>{
      if(path.includes('.success.'))
        return path.slice(0, path.indexOf('.success.'))
    }).filter(path=>typeof (path) != 'undefined')
  testPaths = arrayDsl(testPaths).unique()

  return testPaths
}

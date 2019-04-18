// [require-a-lot] testIncludes begin
const {
  flatten, //*alias* of flat | flat@4.1.0 | https://github.com/hughsk/flat | Take a nested Javascript object and flat...
  arrayDsl,
}
// [require-a-lot] testIncludes end
  = require('../../../requires')

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

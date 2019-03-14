const op = require('object-path')
const flatten = require('flat')

module.exports = (dependencies) => {
  const {
    parameters, resolveData, statusAggregatorResults, extraData, mysqlResults,
    mongoResults, couchdbResults, elasticResults
  } = dependencies
  const data = require('./detailed')(dependencies)
  const detailed = {data}
  const flat = flatten(detailed)
  const paths = Object.keys(flat).filter(path=>path.endsWith('data.name'))
  let structure = {}
  paths.forEach((path, pathIndex) => {
    const splitMagic = path.split('data.')
    splitMagic.pop()
    let pathNameArray = []
    splitMagic.forEach((splitPath, splitPathIndex)=>{
      let realPath = ''
      for(var i = 0;i<=splitPathIndex;i++){
        realPath += splitMagic[i] + 'data.'
      }
      const name = op.get(detailed, realPath + 'name')
      pathNameArray.push(name)
    })

    op.set(structure, pathNameArray.join('.'))
  })
  Object.keys(flatten(structure)).forEach((path)=>op.set(structure, path, true))
  const returnData = {structure}

  return returnData
}

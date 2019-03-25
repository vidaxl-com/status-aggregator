const op = require('object-path')
const flatten = require('flat')

module.exports = (dependencies) => {
  const {
    parameters, resolveData, statusAggregatorResults, extraData, dbResults
  } = dependencies
  const data = require('./detailed')(dependencies)
  const detailed = {data}
  const flatDetailed = flatten(detailed)
  const flatKeys = Object.keys(flatDetailed)
  const showTree = (endsWith, equalsWith) => {
    let structure = {}
    const paths = flatKeys.filter(path=>path.endsWith(endsWith))
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
        const noEquals = typeof equalsWith === 'undefined'
        if(noEquals){
          pathNameArray.push(name)
        }
        if(!noEquals){
          const tmp = op.get(detailed, path)
          if(tmp === equalsWith){
            pathNameArray.push(name)
          }
        }
      })
      if(pathNameArray.length){
        op.set(structure, pathNameArray.join('.'))
      }
    })
    Object.keys(flatten(structure)).forEach((path)=>op.set(structure, path, true))
    // if(dbg)l(structure).lol.die()
    return structure
  }

  const serverStructure = showTree('data.name')
  const dataStatus = showTree('data.status', 'bad', 1)
  const errors = {dataStatus}
  const result =  {errors, serverStructure}

  return result
}

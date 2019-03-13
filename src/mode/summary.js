const op = require('object-path')
const flatten = require('flat')

module.exports = (dependencies) => {
//   const {parameters, resolveData,statusAggregatorResults,extraData,mysqlResults,
//     mongoResults,couchdbResults,elasticResults} = dependencies
//   let results = {}
//   Object.assign(results, resolveData)
//   const detailed = require('./detailed')(dependencies)
//   const detailedKeys = Object.keys(flatten(detailed))
//   const rootName = detailed.name
//   let dataPaths = detailedKeys.filter(path => path.endsWith('.name')).map(path=>{
//     const pathArray = path.split('.')
//     pathArray.pop()
//     return pathArray.join('.')
//   })
//   dataPaths = [''].concat(dataPaths)
//   const dataObjects = {}
//   dataPaths.forEach(path =>{
//     dataObjects[path] = op.get(detailed, path)
//   })
//
//   const names = []
//   const dataObjectKeys = Object.keys(dataObjects)
//   dataObjectKeys.forEach(path => {
//     const dot = path?'.':''
//     names.push(op.get(detailed, `${path}${dot}name`))
//   })
//
//   const structure = {}
//   const parentList = []
//   dataObjectKeys.forEach((path, pathIndex) => {
//     if(!path){
//       parentList.push(false)
//     }
//     if(path){
//       const DO = dataObjectKeys.slice(0, pathIndex).reverse()
//       DO.forEach((reversePath,reversePathIndex)=>{
//
//       })
//     }
//   })
//
//   const belongs = {}
//   // dataPaths.forEach((dataPath1, dataIndex) => {
//   //   const dataPathArray = dataPath1.split('.')
//   //   const dataPathArrayLength = dataPathArray.length
//   //   dataPaths.forEach((dataPath2, data2Index) => {
//   //     const dataPath2Array = dataPath2.split('.')
//   //     const dataPath2ArrayLength = dataPath2Array.length
//   //     // if(dataPath1 && dataPath2ArrayLength>dataPathArrayLength){
//   //     if(dataPath1 && dataPath2ArrayLength>dataPathArrayLength){
//   //
//   //
//   //       if(dataPath2Array.slice(dataPathArrayLength).join('.') === dataPath1){
//   //         let belongPath = belongs[dataPath1]
//   //         if(!belongPath){
//   //           belongPath = belongs[dataPath1] = []
//   //         }
//   //         // belongs[dataPath1] = dataPath2
//   //         belongPath.push(dataPath2)
//   //       }
//   //
//   //
//   //     }
//   //   })
//   // })
//   // console.log(flatten(belongs))
//   // const dataObjectDictionary=['server1', 'server2', 'server3', 'server4', 'server5', 'server6', 'server7', 'server8', 'server9', 'server10']
//   const dpl = dataPaths.length
//   for(let i = 0; i< dpl; i++){
//     const parentdataPathArray = dataPaths[i].split('.')
//     const dataPathArrayLength = dataPathArray.length
//
//     for(let j = 0; j< dataPaths.length; j++){
//       const dataPathArray = dataPaths[j].split('.')
//       const dataPathArrayLength = dataPathArray.length
//
//
//       let array = belongs[]
//       belongs
//
//     }
//   }
//   dataPaths.forEach((dataPath1, dataIndex) => {
//
//   })
//
//   l(belongs,dataPaths).die()
//   Object.keys(belongs).map(belongPath=>{
//     const belongers = belongs[belongPath].reduce((accumulator, currentValue)=>{
//       l(accumulator, currentValue)()
//     })
//
//     // l()
//     belongs[belongPath] = belongs[belongPath][0]
//   })
//
// //   // l('a').die()
// // console.log(belongs)
// //   l(
// //     // rootName
// //      dataPaths,
// //     belongs
// //     // , result
// //     // , op.get(detailed, 'statusAggregatorResults.generatedResults.1.data')
// //     // , results
// //   ).lol.die()
// //
//
//   op.set(result, rootName , {})
//   // l(
//   //   detailedKeys
//   //   , dataPaths
//   //   , rootName
//   //   , result
//   //   // , results
//   // ).lol.die()
//   return results
}

const { Meter, MetricRegistry } = require ('inspector-metrics')
, registry = new MetricRegistry()
  , getCounter = (object, counterId) => op.get(object,counterId,op.set(object,counterId,registry.newMeter(counterId)))
  , getCounterPaths = (counterId) =>
    counterId.split('.').map((entry,cnt,counterArray)=>{
    const resultingArray = []
    for(let i = 0;i<=cnt;i++){
      resultingArray.push(counterArray[i])
    }
    return resultingArray.join('.')

  })
, arrify = require('arrify')
, replaceAll = require("replaceall")
, replaceAllInAll = (from,to,inThose) => arrify(inThose).map(string=>replaceAll(from,to,string))

module.exports = exports = () => {
  const measurements = op.get(exports,'measurements',op.set(exports,'measurements', {}))
  exports.add = (destinationAddress, session = 'noSession', requestAddress = 'noSource') => {
    const replaceResults = replaceAllInAll('.',',', [destinationAddress, requestAddress])
    destinationAddress = replaceResults[0]
    requestAddress = replaceResults[1]
    return getCounterPaths(`${requestAddress}.${destinationAddress}.${session}`).map(path=>{
      return {path:path, counter: getCounter(measurements,path)}
    }).map((entry)=>{
      const pathArray = entry.path.split('.')
        , level = pathArray.length
        , {counter} = entry
      counter.mark(1)
      const oneMinutesAveragePerSecond = counter.avg1Minute.avg

      return {oneMinutesAveragePerSecond, level, pathArray: pathArray}
    }).map(entry=>{
        const {level} = entry;
        const nice = {ok:true}
        return !level?
          Object.assign(nice, entry):
          level===1?
            Object.assign(nice, entry):
            level===2?
              Object.assign(nice, entry):Object.assign(nice, entry)
    })
  }
  return exports
}

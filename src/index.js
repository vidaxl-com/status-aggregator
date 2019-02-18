const dslFramework = require('dsl-framework').noPromoises()
  , responseSenderAdapter = () => {
    return (res, data) => {
      const newStyleResponse = !!res.status
      if(!newStyleResponse) {
        res.json(200, data);
      }
      if(newStyleResponse){
        res.status(200).json(data)
      }
  }
}
  , sendStatusReport = async (res, resultingData) =>
        new Promise((resolve, reject) =>{
          responseSenderAdapter()
          (res, resultingData)
          resolve(resultingData)
        })


module.exports= dslFramework(
  (e, parameters) => {
    const timeSpan = require('time-span');
    const res = parameters.arguments('addResponse', 'lastArgument')

    return new Promise(async (resolve, reject) => {
      let statusAggregatorResults = await require('./pocessors/status-aggregator')(parameters)
      const resolveData = {statusAggregatorResults}
      resolve(resolveData)
      if(res){
        sendStatusReport(res, resolveData)
      }
    })
  }
)

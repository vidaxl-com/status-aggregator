const op = require('object-path')
module.exports = (results) => {
  let badApiResponses = []
  for (let i = 0; i < results.length; i++) {
    let actResult = results[i]
    if(op.get(actResult, 'data.status', 'bad') === 'bad'){
      badApiResponses.push(actResult)
    }
  }

  return badApiResponses
}

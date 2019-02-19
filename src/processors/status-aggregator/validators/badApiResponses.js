module.exports = (results) => {
  let badApiResponses = []
  for (let i = 0; i < results.length; i++) {
    let actResult = results[i]
    if(actResult.status === 'bad'){
      badApiResponses.push(actResult)
    }
  }

  return badApiResponses
}

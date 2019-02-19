module.exports = (results) => {
  let badApiResponses = []
  for (let i = 0; i < results.length; i++) {
    let actResult = results[i]
    if(actResult.data.status === 'bad'){
      badApiResponses.push(actResult)
    }
  }

  return badApiResponses
}

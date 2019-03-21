// [require-a-lot] sessionTestIncludes begin
const {
  axios, //axios@0.18.0 | https://github.com/axios/axios | Promise based HTTP client for the browser and node.js
  expect, //*tag* of chai | chai@4.2.0 | http://chaijs.com | BDD/TDD assertion library for node.js and the browser. T...
  op, //*alias* of object-path | object-path@0.11.4 | https://github.com/mariocasciaro/object-path | Access deep obje...
  flatten, //*alias* of flat | flat@4.1.0 | https://github.com/hughsk/flat | Take a nested Javascript object and flat...
  arrayDsl,
  assert
}
// [require-a-lot] sessionTestIncludes end
  = require('../../lib/requires')

const conditionChecker = (condition, errorMsg='', extraMsg='') => {
  assert(condition, `${errorMsg}${extraMsg?' actual:'+extraMsg:extraMsg}`)

  return condition
}

module.exports = (responseData) =>
{
  responseData = {data:responseData}
  const flatDataKeys = Object.keys(flatten(responseData))

  const sessionTokenPaths = flatDataKeys.filter(path => path.endsWith('request.url.used'))
  const sessionTokens = sessionTokenPaths
    .map(path=>op.get(responseData, path))
    .map(url=>url.slice(url.indexOf('=')+1,url.length))

  const numberOfSessionTokens = (numberIWant, msg) => !(typeof numberIWant === 'undefined')?
    conditionChecker(numberIWant === sessionTokens.length, msg, sessionTokens.length)
    :sessionTokens.length

  const numberOfUniqueSessionTokens = (numberIWant, msg) =>!(typeof numberIWant === 'undefined')?
    conditionChecker(numberIWant === arrayDsl(sessionTokens).unique().length, msg, arrayDsl(sessionTokens).unique().length+'')
    :arrayDsl(sessionTokens).unique().length

  const namePaths = flatDataKeys.filter(path => path.endsWith('data.name'))
  const names = namePaths.map(path=>op.get(responseData, path))
  const uniqueNames = arrayDsl(names).unique()

  const numberOfNames = (numberIWant, msg) => !(typeof numberIWant === 'undefined')?
    conditionChecker(numberIWant === names.length, msg, names.length)
    :names.length

  const numberOfUniqueNames = (numberIWant, msg) => !(typeof numberIWant === 'undefined')?
    conditionChecker(numberIWant === uniqueNames.length, msg, uniqueNames.length)
    :uniqueNames.length

  return {
    numberOfSessionTokens,
    numberOfUniqueSessionTokens,
    numberOfNames,
    numberOfUniqueNames
  }
}

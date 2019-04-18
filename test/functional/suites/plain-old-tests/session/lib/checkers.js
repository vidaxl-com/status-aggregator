// [require-a-lot] testIncludes begin
const {
  flatten, //*alias* of flat | flat@4.1.0 | https://github.com/hughsk/flat | Take a nested Javascript object and flat...
  op, //*alias* of object-path | object-path@0.11.4 | https://github.com/mariocasciaro/object-path | Access deep obje...
  assert, //node module: assert
  arrayDsl,
}
// [require-a-lot] testIncludes end
  = require('../../../../../requires')

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

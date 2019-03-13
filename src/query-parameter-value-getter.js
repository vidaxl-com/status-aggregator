const camelCase = require('camelcase')
const op = require('object-path')

module.exports= (parameters) => (name, defaultRandom=true) => {
  const hasRequestObject = parameters.command.has('request')
    , requestObject = parameters.arguments('request', 'lastArgument', hasRequestObject?{query:{}}:false)
    , noCommand = parameters.arguments(camelCase(`no-${name}`), 'lastArgument')
    , defaultValue = defaultRandom?require('./lib/random-string-generator')():false
  let value = parameters.arguments(camelCase(`${name}-value`), 'lastArgument')
  value = (!noCommand) ?
            value ?
              value :
              requestObject?
                requestObject.query[name]?
                  requestObject.query[name]
                :defaultValue
              :false
            :false
  return value
}

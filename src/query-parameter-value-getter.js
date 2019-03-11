const randomString = () => require('random-string')({
  length: 8,
  numeric: true,
  letters: true,
  special: false,
  exclude: ['i', 'm', 'r', 'e','I', 'M', 'R', 'E']
})
const camelCase = require('camelcase')
const op = require('object-path')

module.exports= (parameters) => (name, defaultRandom=true) => {
  const hasRequestObject = parameters.command.has('request')
    , requestObject = parameters.arguments('request', 'lastArgument', hasRequestObject?{query:{}}:false)
    , noCommand = parameters.arguments(camelCase(`no-${name}`), 'lastArgument')
    , defaultValue = defaultRandom?randomString():false
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

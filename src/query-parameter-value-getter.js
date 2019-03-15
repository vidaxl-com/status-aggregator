const camelCase = require('camelcase')

module.exports= (parameters) =>
  (
    name,
    defaultWeDontHaveGetParameterGetter = () => require('./lib/random-string-generator')(),
    defaultWeHaveNoValueOnTheGetParameterGetter = () => defaultWeDontHaveGetParameterGetter(),
    defaultNoCommandGetter = () => defaultWeHaveNoValueOnTheGetParameterGetter()
  ) => {
  const hasRequestObject = parameters.command.has('request')
    , requestObject = parameters.arguments('request', 'lastArgument', hasRequestObject?{query:{}}:false)
    , noCommand = parameters.arguments(camelCase(`no-${name}`), 'lastArgument')
  let value = parameters.arguments(camelCase(`${name}-value`), 'lastArgument')
  value = (!noCommand) ?
            value ?
              value :
              requestObject?
                requestObject.query[name]?
                  requestObject.query[name]
                :defaultWeDontHaveGetParameterGetter()
              :defaultWeHaveNoValueOnTheGetParameterGetter()
            :defaultNoCommandGetter()
  return value
}

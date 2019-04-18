const dslFramework = require('dsl-framework').noPromoises()

const statusAggregator = require('../../../../src/index')
const arrify = require('arrify')

module.exports = () => (name) => {
  return dslFramework(
    (e, parameters) => (req, res) => {
      statusAggregator.request(req)
      const extraParameters = parameters.arguments('extraParameters', 'lastArgument', {})
      Object.keys(extraParameters)
        .forEach(parameters => arrify(extraParameters[parameters])
          .forEach(item=>statusAggregator[parameters](item)))
      if(name)
        statusAggregator.name(name)
      statusAggregator.addResponse(res)
        .request(req)
        ()
    })
}

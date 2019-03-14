const dslFramework = require('dsl-framework').noPromoises()

const statusGenerator = require('../../../../src/index')
const arrify = require('arrify')

module.exports = () => (name) => {
  return dslFramework(
    (e, parameters) => (req, res) => {
      statusGenerator.request(req)
      const extraParameters = parameters.arguments('extraParameters', 'lastArgument', {})
      Object.keys(extraParameters)
        .forEach(parameters => arrify(extraParameters[parameters])
          .forEach(item=>statusGenerator[parameters](item)))
      if(name)
        statusGenerator.name(name)
      statusGenerator.addResponse(res)
        .request(req)
        ()
    })
}

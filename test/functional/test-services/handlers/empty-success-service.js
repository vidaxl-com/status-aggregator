const dslFramework = require('dsl-framework').noPromoises()

const statusGenerator = require('../../../../src/index')
const arrify = require('arrify')

module.exports = dslFramework(
  (e, parameters) => (req, res) => {
    const extraParameters = parameters.arguments('extraParameters', 'lastArgument', {})
    Object.keys(extraParameters)
      .forEach(parameters => arrify(extraParameters[parameters])
        .forEach(item=>statusGenerator[parameters](item)))
    statusGenerator.addResponse(res)()
  })

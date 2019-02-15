const statusGenerator = require('../../../../src/index')
const arrify = require('arrify')

module.exports = (extraParameters = {}) => (req, res) => {
  Object.keys(extraParameters)
    .forEach(parameters => arrify(extraParameters[parameters])
      .forEach(item=>statusGenerator[parameters](item)))
  statusGenerator.addResponse(res)()
}

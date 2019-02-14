const statusGenerator = require('../../../../src/index')

module.exports = (req, res) => {
  statusGenerator.addResponse(res)()
}

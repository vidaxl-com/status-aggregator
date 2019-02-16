module.exports = (extraParameters = {}) =>
  require('./empty-success-service')
  (Object.assign({fail:['oh yeah ,I wanted to fail']},extraParameters))

module.exports = () =>
  require('./empty-success-service')
    .extraParameters({fail:['oh yeah ,I wanted to fail']})()

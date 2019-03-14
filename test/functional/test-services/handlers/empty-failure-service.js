module.exports = () => (name) => () =>
  require('./empty-success-service')()(name)
    .extraParameters({fail:['oh yeah ,I wanted to fail']})()

const op = require('object-path')
  , tr = require('../../test-generators/bad-and-good-request-tracer')

module.exports = (dataset, asertPath) => {
  Object.keys(dataset)
    .filter(name => name !== 'description')
    .forEach(testKind =>
      dataset[testKind].forEach(testData =>
        tr(testData.description,
          testData.structure,
          op.get(testData, asertPath))))
}

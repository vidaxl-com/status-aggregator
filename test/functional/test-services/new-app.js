module.exports = () => {
  const app = require('express')()
  app.set('etag', false)

  return app
}

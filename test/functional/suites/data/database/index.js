module.exports =  describe('Database suite', ()=> {
  require('./mysql')
  require('./mongo')
  require('./couchdb')
  require('./elastic')
})

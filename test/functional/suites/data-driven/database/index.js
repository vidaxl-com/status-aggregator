module.exports =  describe('Database suite', ()=> {
  !process.env.NODB?
    function () {
      require('./mysql')
      require('./mongo')
      require('./couchdb')
      require('./elastic')
    }():
    null
})

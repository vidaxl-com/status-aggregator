module.exports =  describe('Database suite', ()=> {
  if(!process.env.NODB){
    require('./mysql')
    require('./mongo')
    require('./couchdb')
    require('./elastic')
  }
})

module.exports =  describe('Database suite', ()=> {
  if(process.env.DB){
    require('./mysql')
    require('./mongo')
    require('./couchdb')
    require('./elastic')
  }
})

module.exports = (handler,name)=> ({handler:handler(name)(), name})

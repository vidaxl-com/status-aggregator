module.exports = () =>{
const timeSpan = require('time-span')
 return  (data) =>
   Object.assign(
     data,
     {
       timer:{
         durationMs: timeSpan()(),
         sent:new Date().toUTCString()
       },
    })
}

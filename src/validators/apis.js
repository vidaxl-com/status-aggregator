const isUrl = require('is-url')
module.exports = apis => {
  if(!!apis){
    apis.forEach(apiArray => apiArray.forEach(api =>{
        if(!isUrl(api)){
          throw "The api is not a real url"
        }
      }
    ))
  }
}

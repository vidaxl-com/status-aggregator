const isUrl = require('is-url')
module.exports = (apis, looseUrlCheck) => {
  const malformedUrls=[]
  if(!!apis && !looseUrlCheck){
    apis.forEach(apiArray => apiArray.forEach(api =>{
        if(!isUrl(api)){
          malformedUrls.push(api)
        }
      }
    ))
  }

  return {
    malformedUrls,
    ok: function () {
      return !this.malformedUrls.length
    },
    msg:function () {
      return this.ok() ?
        ''
        :
        this.malformedUrls.map((url)=>{
          `Malformed statusAggregator api URL: ${url}`
        }).join('\n')
    }
  }
}

const aFlatten = require('array-flatten')
const axios = require('axios')
const op = require('object-path')

module.exports = (apis, timeout, looseUrlCheck) => new Promise(async (resolve, reject)=>{
  const apisFlattened = aFlatten(apis)
  let apiRequests = looseUrlCheck ? apis.map(url=>require('addhttp')(url)) : apisFlattened
    const results = []
    const errorResults = []
    for (let i = 0; i < apiRequests.length; i++) {
      const result = {}
      op.set(result, 'request.timeout', timeout)
      op.set(result, 'request.url.original', apisFlattened[i])
      const requestUrl =  apiRequests[i]
      if(apisFlattened[i] !== requestUrl){
        op.set(result, 'request.url.used', requestUrl)
      }
      op.set(result, 'response', {})

      try{
        const apiResult = await axios.get(requestUrl, {
          validateStatus: status => status >= 200 && status < 600, timeout
        })
        op.set(result, 'data', apiResult.data)
        op.set(result, 'response.httpStatus', apiResult.status)

      }
      catch (e) {
        errorResults.push(`Connecting to ${op.get(e, 'request._currentUrl')} was not successful.`)
      }
      results.push(result)
    }

    resolve({
      results,
      errorResults,
      ok: function () {
        return !this.errorResults.length
      },
      msg:function () {
        return this.ok() ?
          ''
          :
          this.errorResults.join('\n')
      }
    })
  })


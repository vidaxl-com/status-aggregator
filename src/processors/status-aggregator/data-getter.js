const aFlatten = require('array-flatten')
  , axios = require('axios')
  , op = require('object-path')
  , urlBuilder = require('build-url')

module.exports = (apis, timeout, looseUrlCheck, sessionDetails) => new Promise(async (resolve, reject)=>{
  const {sessionToken} = sessionDetails
  const apisFlattened = aFlatten(apis)
  let apiRequests = looseUrlCheck ? apisFlattened.map(url=>require('addhttp')(url)) : apisFlattened
  if(sessionToken){
    queryParams = {}
    queryParams['session'] = sessionToken
    apiRequests = apiRequests.map(url => urlBuilder(url, {
      queryParams
    }))
  }
  const results = []
    , errorResults = []
    , errorObjects = []
    for (let i = 0; i < apiRequests.length; i++) {
      const result = {}
      op.set(result, 'request.timeout', timeout)
      op.set(result, 'request.url.original', apisFlattened[i])
      const requestUrl =  apiRequests[i]
      op.set(result, 'request.url.used', requestUrl)
      op.set(result, 'response', {})

      try{
        const apiResult = await axios.get(requestUrl, {
          validateStatus: status => status >= 200 && status < 600, timeout
        })
        op.set(result, 'data', apiResult.data)
        op.set(result, 'response.httpStatus', apiResult.status)

      }
      catch (e) {
        // l(e)('lol')('die')
        errorObjects.push({
            pendingData: op.get(e, 'request._currentRequest.socket._pendingData'),
            currentUrl: op.get(e,'request._currentUrl'),
            name: e.name,
            message: e.message,
            stack: e.stack,
            response: e.response
          })
        errorResults.push(`Connecting to ${op.get(e, 'request._currentUrl')} was not successful.`)
      }
      results.push(result)
    }

    resolve({
      results,
      errorResults,
      errorObjects,
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


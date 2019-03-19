const aFlatten = require('array-flatten')
  , axios = require('axios')
  , op = require('object-path')
  , urlBuilder = require('build-url')
  , meter = require('./meter')()

module.exports = (apis, timeout, looseUrlCheck, sessionDetails, parameters) => new Promise(async (resolve, reject)=>{
  const {sessionToken} = sessionDetails
    , apisFlattened = aFlatten(apis)
    , requestObject = parameters.arguments('request', 'lastArgument',{})
    , requestAddress = op.get(requestObject, 'headers.x-forwarded-for', false) || requestObject.ip ||
    op.get(requestObject, 'connection.remoteAddress') || 'noIp'
  const originalApiRequestUrls = looseUrlCheck ? apisFlattened.map(url=>require('addhttp')(url)) : apisFlattened
  if(sessionToken){
    queryParams = {}
    queryParams['session'] = sessionToken
    apiRequests = originalApiRequestUrls.map(url => urlBuilder(url, {
      queryParams
    }))
  }

  const pendingPromises = []
  for (let i = 0; i < apiRequests.length; i++) {
    const requestUrl =  apiRequests[i]
    const meters = meter.add(originalApiRequestUrls[i], sessionToken, requestAddress)
    l(meters).lol()
    pendingPromises.push(axios.get(requestUrl, {
    validateStatus: status => status >= 200 && status < 600, timeout}))
  }

  const errorResults = []
  const errorObjects = []
  Promise.all(pendingPromises).catch(e=>{
    errorObjects.push({
      pendingData: op.get(e, 'request._currentRequest.socket._pendingData'),
      currentUrl: op.get(e,'request._currentUrl'),
      name: e.name,
      message: e.message,
      stack: e.stack,
      response: e.response
    })
    errorResults.push(`Connecting to ${op.get(e, 'request._currentUrl')} was not successful.`)

    }).then(promiseResults => {
      let results = []
      if(promiseResults)
      promiseResults.forEach((res, i)=>{
        const result = {}
        op.set(result, 'request.timeout', timeout)

        op.set(result, 'request.url.original', apisFlattened[i])
        const requestUrl =  apiRequests[i]
        op.set(result, 'request.url.used', requestUrl)
        op.set(result, 'response', {})

        op.set(result, 'data', res.data)
        op.set(result, 'response.httpStatus', res.status)

        results.push(result)
      })
// l()
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
  })


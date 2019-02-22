const aFlatten = require('array-flatten')
const axios = require('axios')
const op = require('object-path')

module.exports = (apis, timeout) => new Promise(async (resolve, reject)=>{
    const results = []
    const errorResults = []
    const apisFlattened = aFlatten(apis)
    for (let i = 0; i < apisFlattened.length; i++) {
      try{
        const apiResult = await axios.get(apisFlattened[i],{
          validateStatus: function (status) {
            return status >= 200 && status < 600; // default
          },
          timeout: timeout
        })
        results.push({data: apiResult.data, httpStatus: apiResult.status})
      }
      catch (e) {
        errorResults.push(`Connecting to ${op.get(e, 'request._currentUrl')} was not successful.`)
      }
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


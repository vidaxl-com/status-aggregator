const aFlatten = require('array-flatten')
const axios = require('axios')
const op = require('object-path')

module.exports = (apis, timeout) => new Promise(async (resolve, reject)=>{
    let msg = ''
    const results = []
    const apisFlattened = aFlatten(apis)
    for (let i = 0; i < apisFlattened.length; i++) {
      try{
        results.push(await axios.get(apisFlattened[i],{
          validateStatus: function (status) {
            return status >= 200 && status < 600; // default
          },
          timeout: timeout
        }))
      }
      catch (e) {
        msg += `Connecting to ${op.get(e, 'request._currentUrl')} was not successful \n`
      }
    }

    resolve({msg, results})
  })


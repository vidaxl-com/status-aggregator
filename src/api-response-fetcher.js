const axios = require('axios')
const aFlatten = require('array-flatten')

module.exports= (apis) =>
  new Promise(async (resolve, reject) => {
    results = []
    let apiErrorMessages = ''
    const apisFlattened = aFlatten(apis)

    for (let i = 0; i < apisFlattened.length; i++) {
      try {
        results.push(await axios.get(apisFlattened[i], {
          validateStatus: function (status) {
            return status >= 200 && status < 600;
          }
        }))
      } catch (e) {
        apiErrorMessages += `Connecting to ${e.request._currentUrl} was not successful \n`
      }
    }
    resolve({results, apiErrorMessages})
  })





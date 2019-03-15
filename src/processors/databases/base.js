module.exports = (connector) => (configs) => (parameters) => new Promise(async (resolve, reject)=>{
  const results = []
  let status = 'ok'
  for(let i = 0; i<configs.length; i++ ){
    const config = configs[i]
    const result = await connector(config, parameters)
    // l(result)()
    if(result.status === 'bad'){
      status = 'bad'
    }
    results.push(result)
  }

  resolve({status, results})
})

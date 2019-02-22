module.exports = (connector) => (configs) => new Promise(async (resolve, reject)=>{
  const results = []
  let status = 'ok'
  for(let i = 0; i<configs.length; i++ ){
    const config = configs[i]
    const result = await connector(config)
    // l(result)()
    if(result.status === 'bad'){
      status = 'bad'
    }
    results.push(result)
  }

  resolve({results, status})
})

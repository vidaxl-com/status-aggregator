module.exports = (array)=>{
  array.stop = () => array.forEach(serverObject=>{
    serverObject.stop()
  })

  return array
}

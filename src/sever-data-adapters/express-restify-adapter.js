module.exports = (oldStyleRequest) => ({
  responseSend: (res, data) => {
    if(oldStyleRequest) {
      res.json(200, data);
    }
    if(!oldStyleRequest){
      res.status(200).json(data)
    }
  }
})


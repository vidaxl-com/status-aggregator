module.exports = {
  responseSend: (res, data) => {
    const newStyleResponse = !!res.status
    if(!newStyleResponse) {
      res.json(200, data);
    }
    if(newStyleResponse){
      res.status(200).json(data)
    }
  }
}


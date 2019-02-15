module.exports = (extraParameters = {}) => (req,res) => {
  res
    .status(200)
    .json({status:'bad'})
}

const transform = require('./transform')

module.exports = transaction => {
  console.log(JSON.stringify(transform(transaction), null, 4))
}

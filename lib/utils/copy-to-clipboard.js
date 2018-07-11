const clipboardy = require('clipboardy')
const transform = require('./transform')

module.exports = transaction => {
  clipboardy.writeSync(JSON.stringify(transform(transaction), null, 4))

  console.log(`Copied transaction ${transaction.id}`)
}

const fs = require('fs')
const transform = require('./transform')

module.exports = (transaction, file) => {
  fs.writeFile(file, transform(JSON.stringify(transaction, null, 4)), (err) => {
      if (err) {
          console.error(err)

          return
      }

      console.log(`Wrote transaction ${transaction.id} to  ${file}`)
  })
}

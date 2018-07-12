const ark = require('arkjs')
const command = require('../command')
const serializeTransaction = require('../../utils/serialize-transaction')

module.exports = options => command(options, () => {
  const transaction = ark.signature.createSignature(
    options.passphrase,
    options.secondPassphrase
  )

  return serializeTransaction(transaction)
})

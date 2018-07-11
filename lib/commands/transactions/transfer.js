const ark = require('arkjs')
const command = require('../command')
const serializeTransaction = require('../../utils/serialize-transaction')

module.exports = options => command(options, () => {
  const transaction = ark.transaction.createTransaction(
    options.recipient || ark.crypto.getAddress(ark.crypto.getKeys(options.passphrase).publicKey),
    options.amount,
    options.vendorField,
    options.passphrase,
    options.secondPassphrase || 'secondPassphrase'
  )

  return serializeTransaction(transaction)
})

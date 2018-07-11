const ark = require('arkjs')
const command = require('./command')

module.exports = options => command(options, () => {
  return ark.transaction.createTransaction(
      options.recipient || ark.crypto.getAddress(ark.crypto.getKeys(options.passphrase).publicKey),
      options.amount,
      options.vendorField,
      options.passphrase,
      options.secondPassphrase || 'secondPassphrase'
  )
})

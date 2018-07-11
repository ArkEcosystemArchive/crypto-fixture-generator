const ark = require('arkjs')
const command = require('../command')
const serializeTransaction = require('../../utils/serialize-transaction')

module.exports = options => command(options, () => {
  const transaction = ark.delegate.createDelegate(
    options.username,
    options.passphrase,
    options.secondPassphrase || 'secondPassphrase'
  )

  return serializeTransaction(transaction)
})

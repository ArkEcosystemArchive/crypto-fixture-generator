const ark = require('arkjs')
const command = require('../command')
const serializeTransaction = require('../../utils/serialize-transaction')

module.exports = options => command(options, () => {
  const transaction = ark.vote.createVote(
    options.passphrase,
    [`-${options.delegate}`],
    options.secondPassphrase || 'secondPassphrase'
  )

  return serializeTransaction(transaction)
})

const { Transaction } = require('@arkecosystem/crypto').models

module.exports = data => ({
  data,
  serialized: Transaction.serialize(data).toString('hex')
})

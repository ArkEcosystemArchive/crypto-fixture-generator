const { Transaction } = require('@arkecosystem/crypto').models

module.exports = transaction => {
    return {
        transaction,
        serialized: Transaction.serialize(transaction).toString('hex')
    }
}

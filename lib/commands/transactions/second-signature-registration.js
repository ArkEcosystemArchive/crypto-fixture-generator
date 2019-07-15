const { Transactions } = require('@arkecosystem/crypto');
const command = require('../command');
const serializeTransaction = require('../../utils/serialize-transaction');

module.exports = options =>
  command(options, () => {
    const transaction = Transactions.BuilderFactory.secondSignature()
      .signatureAsset(options.secondPassphrase)
      .sign(options.passphrase);

    return serializeTransaction(transaction.build());
  });

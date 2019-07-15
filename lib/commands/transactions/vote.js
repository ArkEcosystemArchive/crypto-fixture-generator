const { Transactions } = require('@arkecosystem/crypto');
const command = require('../command');
const serializeTransaction = require('../../utils/serialize-transaction');

module.exports = options =>
  command(options, () => {
    const transaction = Transactions.BuilderFactory.vote()
      .voteAsset([`+${options.delegate}`])
      .sign(options.passphrase);

    if (options.secondPassphrase) {
      transaction.secondSign(options.secondPassphrase);
    }

    return serializeTransaction(transaction.build());
  });

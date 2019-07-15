const { Transactions, Identities } = require("@arkecosystem/crypto");
const command = require("../command");
const serializeTransaction = require("../../utils/serialize-transaction");

module.exports = options =>
    command(options, () => {
        const transaction = Transactions.BuilderFactory.transfer()
            .recipientId(options.recipient || Identities.Address.fromPassphrase(options.passphrase))
            .amount(options.amount)
            .sign(options.passphrase);

        if (options.vendorField) {
            transaction.vendorField(options.vendorField);
        }

        if (options.secondPassphrase) {
            transaction.secondSign(options.secondPassphrase);
        }

        return serializeTransaction(transaction);
    });

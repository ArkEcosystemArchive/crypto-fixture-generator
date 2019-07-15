const { Identities } = require("@arkecosystem/crypto");
const command = require("../command");

module.exports = options =>
    command(options, () => {
        return {
            data: {
                privateKey: Identities.PrivateKey.fromPassphrase(options.passphrase),
                publicKey: Identities.PublicKey.fromPassphrase(options.passphrase),
                address: Identities.Address.fromPassphrase(options.passphrase),
                wif: Identities.WIF.fromPassphrase(options.passphrase),
            },
            passphrase: options.passphrase,
        };
    });

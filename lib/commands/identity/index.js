const ark = require('arkjs')
const command = require('../command')

module.exports = options => command(options, () => {
  const keys = ark.crypto.getKeys(options.passphrase)

  return {
    data: {
      privateKey: keys.d.toBuffer().toString('hex'),
      publicKey: keys.publicKey,
      address: ark.crypto.getAddress(keys.publicKey),
      wif: keys.toWIF()
    },
    passphrase: options.passphrase
  }
})

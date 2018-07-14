const ark = require('arkjs')
const crypto = require('crypto')
const command = require('../command')

module.exports = options => command(options, () => {
  const keys = ark.crypto.getKeys(options.passphrase)
  const hash = crypto.createHash('sha256').update(Buffer.from(options.message, 'utf-8')).digest()

  return {
    data: {
      publicKey: keys.publicKey,
      signature: keys.sign(hash).toDER().toString('hex'),
      message: options.message
    },
    passphrase: options.passphrase
  }
})

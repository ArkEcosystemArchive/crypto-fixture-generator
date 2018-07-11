const ark = require('arkjs')
const command = require('./command')

module.exports = options => command(options, () => {
  return ark.signature.createSignature(
    options.passphrase,
    options.secondPassphrase || 'passphrase'
  )
})

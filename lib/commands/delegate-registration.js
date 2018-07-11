const ark = require('arkjs')
const command = require('./command')

module.exports = options => command(options, () => {
  return ark.delegate.createDelegate(
    options.username,
    options.passphrase,
    options.secondPassphrase || 'secondPassphrase'
  )
})

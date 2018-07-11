const ark = require('arkjs')
const command = require('./command')

module.exports = options => command(options, () => {
  return ark.vote.createVote(
    options.passphrase,
    [`-${options.delegate}`],
    options.secondPassphrase || 'secondPassphrase'
  )
})

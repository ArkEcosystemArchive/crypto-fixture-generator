const {
    copyToClipboard,
    logToTerminal,
    setNetwork
} = require('../utils')

module.exports = (options, callback) => {
    setNetwork(options.network)

    const transaction = callback()

    if (options.copy) {
        copyToClipboard(transaction)
    }

    if (options.log) {
        logToTerminal(transaction)
    }
}

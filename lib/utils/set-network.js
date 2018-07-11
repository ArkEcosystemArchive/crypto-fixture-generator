const ark = require('arkjs')

module.exports = network => {
    ark.crypto.setNetworkVersion({
        mainnet: 0x17,
        devnet: 0x1e
    }[network])
}
